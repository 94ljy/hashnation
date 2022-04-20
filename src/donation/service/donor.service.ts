import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { DonationEntity, DonationStatus } from '../entity/donation.entity'
import {
    clusterApiUrl,
    Connection,
    SystemProgram,
    Transaction,
} from '@solana/web3.js'
import base58 from 'bs58'
import { ns64, struct, u32 } from '@solana/buffer-layout'
import nacl from 'tweetnacl'
import { CreatorService } from '../../creator/creator.service'

const TRANSFER_INSTRUCTION_INDEX = 2

const TRANSFER_INSTRUCTION = struct<{ instruction: number; lamports: number }>([
    u32('instruction'),
    ns64('lamports'),
])

@Injectable()
export class DonorService {
    private readonly solanaConn: Connection
    constructor(
        @InjectRepository(DonationEntity)
        private readonly donationRepository: Repository<DonationEntity>,
        private readonly creatorService: CreatorService,
    ) {
        this.solanaConn = new Connection(clusterApiUrl('devnet'))
    }

    async donate(fromUserId: string, rawTransaction: string, message: string) {
        const transaction = Transaction.from(base58.decode(rawTransaction))

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

        const toCreator = await this.creatorService.getCreator(
            'id',
            to.pubkey.toString(),
        )

        const donation = await this.donationRepository.save({
            txSignature: base58.encode(transaction.signature),
            message,
            createdAt: new Date(),
            fromId: from.pubkey.toString(),
            lamports: parsedData.lamports,
            status: DonationStatus.PENDING,
            isBrodcasted: false,
            toId: toCreator.id,
        })

        // transaction validate complete

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

        return {
            tx: donation.txSignature,
        }
    }

    async getCreatorInfoByPublicKey(publicKey: string) {
        const user = await this.creatorService.getCreator('username', publicKey)

        return {
            publicKey: user.id,
            username: user.username,
        }
    }

    // // TODO: add invalid to public key
    // async donate(txSignature: string, message: string, signature: string) {
    //     const txResponse = await this.solanaConn.getTransaction(txSignature)

    //     // tx not found
    //     if (!txResponse) throw new BadRequestException('Invalid tx signature')

    //     // tx error
    //     if (txResponse.meta.err) throw new BadRequestException('tx error')

    //     // tx invalide
    //     if (txResponse.transaction.message.instructions.length !== 1)
    //         throw new BadRequestException('Invalid tx')

    //     const instruction = txResponse.transaction.message.instructions[0]

    //     const instructionProgramId =
    //         txResponse.transaction.message.accountKeys[
    //             instruction.programIdIndex
    //         ]

    //     // tx not from system program
    //     if (!SystemProgram.programId.equals(instructionProgramId))
    //         throw new BadRequestException('Invalid programId')

    //     const parsedData = TRANSFER_INSTRUCTION.decode(
    //         base58.decode(instruction.data),
    //     )

    //     // tx not transfer instruction
    //     if (parsedData.instruction !== TRANSFER_INSTRUCTION_INDEX)
    //         throw new BadRequestException('Invalid instruction index')

    //     const fromKey =
    //         txResponse.transaction.message.accountKeys[instruction.accounts[0]]

    //     const toKey =
    //         txResponse.transaction.message.accountKeys[instruction.accounts[1]]

    //     if (
    //         !nacl.sign.detached.verify(
    //             new TextEncoder().encode(txSignature),
    //             base58.decode(signature),
    //             fromKey.toBuffer(),
    //         )
    //     )
    //         throw new BadRequestException('Invalid signature')

    //     const lamports = parsedData.lamports

    //     const to = await this.userService.getUser('publicKey', toKey.toString())

    //     const donation = new DonationEntity()
    //     donation.txSignature = txSignature
    //     donation.message = message
    //     donation.createdAt = new Date()
    //     donation.from = fromKey.toString()
    //     donation.lamports = lamports
    //     donation.isBrodcasted = false
    //     donation.toId = to.id

    //     await this.donationRepository.save(donation)
    // }
}
