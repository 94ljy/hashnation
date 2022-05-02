import {
    BadRequestException,
    Inject,
    Injectable,
    LoggerService,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Donation, DonationStatus } from '../../entities/donation.entity'
import {
    clusterApiUrl,
    Connection,
    SystemProgram,
    Transaction,
    Cluster,
} from '@solana/web3.js'
import base58 from 'bs58'
import { ns64, struct, u32 } from '@solana/buffer-layout'
import { UserService } from '../../user/user.service'
import { WalletService } from '../../wallet/wallet.service'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston'
import { ConfigService } from '../../config/config.service'

const TRANSFER_INSTRUCTION_INDEX = 2

const TRANSFER_INSTRUCTION = struct<{ instruction: number; lamports: number }>([
    u32('instruction'),
    ns64('lamports'),
])

@Injectable()
export class DonorService {
    private readonly solanaConn: Connection
    constructor(
        private readonly eventEmitter: EventEmitter2,
        private readonly userService: UserService,
        private readonly walletService: WalletService,
        @InjectRepository(Donation)
        private readonly donationRepository: Repository<Donation>,
        private readonly configService: ConfigService,
        @Inject(WINSTON_MODULE_NEST_PROVIDER)
        private readonly logger: LoggerService,
    ) {
        this.solanaConn = new Connection(
            clusterApiUrl(this.configService.get('SOLANA_CLUSTER') as Cluster),
        )
    }

    async getCreatorInfo(username: string) {
        const user = await this.userService.getUserByUsername(username)

        if (!user) throw new BadRequestException(`User ${username} not found`)

        const wallets = await this.walletService.getUserWallet(user.id)

        return {
            username: user.username,
            wallets: wallets.map((item) => ({
                address: item.address,
            })),
        }
    }

    verifyTransaction(transaction: Transaction) {
        if (transaction.signature === null || !transaction.verifySignatures()) {
            this.logger.error('Transaction signature verification failed')
            throw new BadRequestException(
                'Transaction signature verification failed',
            )
        }

        // tx validations
        if (transaction.instructions.length !== 1) {
            this.logger.error('Invalid number of instructions')
            throw new BadRequestException('Invalid number of instructions')
        }

        const instruction = transaction.instructions[0]

        // tx validations
        if (!SystemProgram.programId.equals(instruction.programId)) {
            this.logger.error('Invalid programId')
            throw new BadRequestException('Invalid programId')
        }

        const parsedData = TRANSFER_INSTRUCTION.decode(instruction.data)

        // tx validations
        if (parsedData.instruction !== TRANSFER_INSTRUCTION_INDEX) {
            this.logger.error('Invalid instruction index')
            throw new BadRequestException('Invalid instruction index')
        }

        const from = instruction.keys[0]
        const to = instruction.keys[1]

        return {
            signature: base58.encode(transaction.signature),
            from: from.pubkey.toString(),
            to: to.pubkey.toString(),
            lamports: parsedData.lamports,
        }
    }

    async donate(toUsername: string, rawTransaction: string, message: string) {
        const transaction = Transaction.from(base58.decode(rawTransaction))
        const { signature, from, to, lamports } =
            this.verifyTransaction(transaction)

        const toUser = await this.userService.getUserByUsername(toUsername)

        if (!toUser)
            throw new BadRequestException(`User ${toUsername} not found`)

        const hasWallet = await this.walletService.hasWalletAddress(
            toUser.id,
            to,
        )

        if (!hasWallet) {
            this.logger.error(`User does not have a wallet address ${to}`)
            throw new BadRequestException(`User has no wallet address ${to}`)
        }

        const donation = new Donation()
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
            this.logger.error(`tx:${tx} Transaction failed ${result.value.err}`)

            await this.donationRepository.update(donation.id, {
                status: DonationStatus.REJECTED,
            })
        } else {
            await this.donationRepository.update(donation.id, {
                status: DonationStatus.APPROVED,
            })

            this.eventEmitter.emit('widget.donate', donation)
        }

        return {
            err: result.value.err,
            tx: tx,
        }
    }
}
