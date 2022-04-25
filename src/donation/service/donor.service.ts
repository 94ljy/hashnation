import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { DonationEntity, DonationStatus } from '../../entities/donation.entity'
import {
    clusterApiUrl,
    Connection,
    SystemProgram,
    Transaction,
} from '@solana/web3.js'
import base58 from 'bs58'
import { ns64, struct, u32 } from '@solana/buffer-layout'
import { UserService } from '../../user/user.service'
import { WalletService } from '../../wallet/wallet.service'

const TRANSFER_INSTRUCTION_INDEX = 2

const TRANSFER_INSTRUCTION = struct<{ instruction: number; lamports: number }>([
    u32('instruction'),
    ns64('lamports'),
])

@Injectable()
export class DonorService {
    private readonly solanaConn: Connection
    constructor(
        private readonly userService: UserService,
        private readonly walletService: WalletService,
        @InjectRepository(DonationEntity)
        private readonly donationRepository: Repository<DonationEntity>,
    ) {
        this.solanaConn = new Connection(clusterApiUrl('devnet'))
    }

    async getCreatorInfo(username: string) {
        const user = await this.userService.getUserByUsername(username)
        const wallets = await this.walletService.getUserWallet(user.id)

        return {
            username: user.username,
            wallets: wallets.map((item) => ({
                address: item.address,
            })),
        }
    }

    verifyTransaction(rawTransaction: string) {
        const transaction = Transaction.from(base58.decode(rawTransaction))

        if (!transaction.verifySignatures()) {
            throw new BadRequestException('Invalid signature')
        }

        // tx validations
        if (transaction.instructions.length !== 1) {
            throw new BadRequestException('Invalid tx')
        }

        const instruction = transaction.instructions[0]

        // tx validations
        if (!SystemProgram.programId.equals(instruction.programId))
            throw new BadRequestException('Invalid programId')

        const parsedData = TRANSFER_INSTRUCTION.decode(instruction.data)

        // tx validations
        if (parsedData.instruction !== TRANSFER_INSTRUCTION_INDEX)
            throw new BadRequestException('Invalid instruction index')

        const from = instruction.keys[0]
        const to = instruction.keys[1]

        return {
            transaction,
            signature: base58.encode(transaction.signature),
            from: from.pubkey.toString(),
            to: to.pubkey.toString(),
            lamports: parsedData.lamports,
        }
    }

    async donate(toUsername: string, rawTransaction: string, message: string) {
        const { transaction, signature, from, to, lamports } =
            this.verifyTransaction(rawTransaction)

        const toUser = await this.userService.getUserByUsername(toUsername)

        const hasWallet = this.walletService.hasWalletAddress(toUser.id, to)

        if (!hasWallet) {
            throw new BadRequestException(`User has no wallet address ${to}`)
        }

        const donation = new DonationEntity()
        donation.txSignature = signature
        donation.message = message
        donation.fromAddress = from
        donation.toAddress = to
        donation.toUser = toUser
        donation.status = DonationStatus.PENDING
        donation.lamports = lamports

        await this.donationRepository.save(donation)

        const tx = await this.solanaConn.sendRawTransaction(
            transaction.serialize(),
        )

        const result = await this.solanaConn.confirmTransaction(tx)

        if (result.value.err) {
            await this.donationRepository.update(donation.id, {
                status: DonationStatus.REJECTED,
            })
            throw new BadRequestException(result.value.err)
        } else {
            await this.donationRepository.update(donation.id, {
                status: DonationStatus.APPROVED,
            })
        }
    }
}
