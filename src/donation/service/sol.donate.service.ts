import { BadRequestException, Injectable } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { ns64, struct, u32 } from '@solana/buffer-layout'
import {
    Cluster,
    clusterApiUrl,
    Connection,
    Transaction,
} from '@solana/web3.js'
import base58 from 'bs58'
import { CURRENCY_TYPE } from '../../common/currency'
import { ConfigService } from '../../config/config.service'
import { WIDGET_DONATE_EVENT } from '../../event/event'
import { AppLogger } from '../../logger/logger.service'
import { DonationRepository } from '../../repository/donation.repository'
import {
    Donation,
    DonationStatus,
} from '../../repository/entities/donation.entity'
import { UserService } from '../../user/user.service'
import { WalletService } from '../../wallet/wallet.service'
import { SolTransferService } from './sol.transfer.service'

export const TRANSFER_INSTRUCTION_INDEX = 2

export const TRANSFER_INSTRUCTION = struct<{
    instruction: number
    lamports: number
}>([u32('instruction'), ns64('lamports')])

@Injectable()
export class SolDonateService {
    private readonly solanaConn: Connection
    constructor(
        private readonly eventEmitter: EventEmitter2,
        private readonly userService: UserService,
        private readonly walletService: WalletService,
        private readonly configService: ConfigService,
        private readonly logger: AppLogger,
        private readonly donationRepository: DonationRepository,
        private readonly solTransferService: SolTransferService,
    ) {
        this.solanaConn = new Connection(
            clusterApiUrl(this.configService.get('SOLANA_CLUSTER') as Cluster),
        )
    }

    rawTransactionToTransaction(rawTransaction: string) {
        return Transaction.from(base58.decode(rawTransaction))
    }

    async sendRawTransaction(rawTransaction: Buffer) {
        return this.solanaConn.sendRawTransaction(rawTransaction)
    }

    async confirmTransaction(tx: string) {
        return this.solanaConn.confirmTransaction(tx)
    }

    async donate(toUsername: string, rawTransaction: string, message: string) {
        const toUser = await this.userService.getUserByUsername(toUsername)

        if (!toUser)
            throw new BadRequestException(`User ${toUsername} not found`)

        const transaction = this.rawTransactionToTransaction(rawTransaction)

        const { signature, from, to, lamports } =
            this.solTransferService.unpack(transaction)

        const hasWallet = await this.walletService.hasWalletAddress(
            toUser.id,
            to,
        )

        if (!hasWallet) {
            this.logger.error(`User does not have a wallet address ${to}`)
            throw new BadRequestException(
                `User does not have a wallet address ${to}`,
            )
        }

        const donation = new Donation()
        donation.currency = CURRENCY_TYPE.SOL
        donation.txHash = signature
        donation.message = message
        donation.fromAddress = from
        donation.toAddress = to
        donation.toUser = toUser
        donation.status = DonationStatus.PENDING
        donation.amount = lamports

        await this.donationRepository.createDonation(donation)

        const tx = await this.sendRawTransaction(transaction.serialize())

        const result = await this.confirmTransaction(tx)

        if (result.value.err) {
            this.logger.error(`tx:${tx} Transaction failed ${result.value.err}`)

            await this.donationRepository.updateDonationStatus(
                donation.id,
                DonationStatus.REJECTED,
            )
        } else {
            await this.donationRepository.updateDonationStatus(
                donation.id,
                DonationStatus.APPROVED,
            )

            this.eventEmitter.emit(WIDGET_DONATE_EVENT, donation)
        }

        return {
            err: result.value.err,
            tx: tx,
        }
    }
}
