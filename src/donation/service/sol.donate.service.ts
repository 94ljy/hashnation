import { BadRequestException, Injectable } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { ns64, struct, u32 } from '@solana/buffer-layout'
import { Transaction } from '@solana/web3.js'
import base58 from 'bs58'
import { Connection } from 'typeorm'
import { CURRENCY_TYPE } from '../../common/currency'
import { AppLogger } from '../../logger/logger.service'
import { DonationRepository } from '../repository/donation.repository'
import { Donation, DonationStatus } from '../domain/donation.entity'
import { UserService } from '../../user/user.service'
import { WalletService } from '../../wallet/wallet.service'
import { DonationCreatedEvent } from '../event/donation.created.event'
import { SolanaConnection } from './sol.connection'
import { DonationApprovedEvent } from '../event/donation.approve.event'
import { SolTransferTransaction } from './sol.transfer.transaction'

export const TRANSFER_INSTRUCTION_INDEX = 2

export const TRANSFER_INSTRUCTION = struct<{
    instruction: number
    lamports: number
}>([u32('instruction'), ns64('lamports')])

@Injectable()
export class SolDonateService {
    constructor(
        private readonly eventEmitter: EventEmitter2,
        private readonly userService: UserService,
        private readonly walletService: WalletService,
        private readonly logger: AppLogger,
        private readonly donationRepository: DonationRepository,
        private readonly solanaConn: SolanaConnection,
    ) {}

    rawTransactionToTransaction(rawTransaction: string) {
        return SolTransferTransaction.fromRawTransaction(rawTransaction)
    }

    async donate(toUsername: string, rawTransaction: string, message: string) {
        const toUser = await this.userService.getUserByUsername(toUsername)

        if (!toUser)
            throw new BadRequestException(`User ${toUsername} not found`)

        const { signature, from, to, lamports, transaction } =
            this.rawTransactionToTransaction(rawTransaction)

        const userWallets = await this.walletService.getUserWallets(toUser.id)

        if (!userWallets.hasWallet(CURRENCY_TYPE.SOL, to)) {
            this.logger.error(`User does not have a wallet address ${to}`)
            throw new BadRequestException(
                `User does not have a wallet address ${to}`,
            )
        }

        const donation = Donation.createPendingDonation(
            CURRENCY_TYPE.SOL,
            signature,
            message,
            from,
            to,
            toUser,
            lamports,
        )

        const createdDonation = await this.donationRepository.save(donation)

        const tx = await this.solanaConn.sendRawTransaction(
            transaction.serialize(),
        )

        this.eventEmitter.emitAsync(
            DonationCreatedEvent.name,
            DonationCreatedEvent.from(createdDonation),
        )

        const result = await this.solanaConn.confirmTransaction(tx)

        if (result.value.err) {
            this.logger.error(`tx:${tx} Transaction failed ${result.value.err}`)
            createdDonation.reject()
        } else {
            createdDonation.approve()
        }

        const updatedDonation = await this.donationRepository.save(
            createdDonation,
        )
        if (updatedDonation.status === DonationStatus.APPROVED)
            this.eventEmitter.emitAsync(
                DonationApprovedEvent.name,
                DonationApprovedEvent.from(updatedDonation),
            )

        return {
            err: result.value.err,
            tx: tx,
        }
    }
}
