import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { DonationEntity } from '../entity/donation.entity'
import { clusterApiUrl, Connection, SystemProgram } from '@solana/web3.js'
import base58 from 'bs58'
import { ns64, struct, u32 } from '@solana/buffer-layout'
import nacl from 'tweetnacl'
import { UserService } from '../../user/user.service'
import { UserEntity } from '../../user/entity/user.entity'

const TRANSFER_INSTRUCTION_INDEX = 2

const TRANSFER_INSTRUCTION = struct<{ instruction: number; lamports: number }>([
    u32('instruction'),
    ns64('lamports'),
])

@Injectable()
export class DonateService {
    private readonly solanaConn: Connection
    constructor(
        @InjectRepository(DonationEntity)
        private readonly donationRepository: Repository<DonationEntity>,
        private readonly userService: UserService,
    ) {
        this.solanaConn = new Connection(clusterApiUrl('devnet'))
    }

    // TODO: add invalid to public key
    async donate(txSignature: string, message: string, signature: string) {
        const txResponse = await this.solanaConn.getTransaction(txSignature)

        // tx not found
        if (!txResponse) throw new BadRequestException('Invalid tx signature')

        // tx error
        if (txResponse.meta.err) throw new BadRequestException('tx error')

        // tx invalide
        if (txResponse.transaction.message.instructions.length !== 1)
            throw new BadRequestException('Invalid tx')

        const instruction = txResponse.transaction.message.instructions[0]

        const instructionProgramId =
            txResponse.transaction.message.accountKeys[
                instruction.programIdIndex
            ]

        // tx not from system program
        if (!SystemProgram.programId.equals(instructionProgramId))
            throw new BadRequestException('Invalid programId')

        const parsedData = TRANSFER_INSTRUCTION.decode(
            base58.decode(instruction.data),
        )

        // tx not transfer instruction
        if (parsedData.instruction !== TRANSFER_INSTRUCTION_INDEX)
            throw new BadRequestException('Invalid instruction index')

        const fromKey =
            txResponse.transaction.message.accountKeys[instruction.accounts[0]]

        const toKey =
            txResponse.transaction.message.accountKeys[instruction.accounts[1]]

        if (
            !nacl.sign.detached.verify(
                new TextEncoder().encode(txSignature),
                base58.decode(signature),
                fromKey.toBuffer(),
            )
        )
            throw new BadRequestException('Invalid signature')

        const lamports = parsedData.lamports

        const to = await this.userService.getUser(toKey.toString())

        const toEntity = new UserEntity()

        toEntity.id = to.id

        const donation = new DonationEntity()
        donation.txSignature = txSignature
        donation.message = message
        donation.createdAt = new Date()
        donation.from = fromKey.toString()
        donation.lamports = lamports
        donation.isBrodcasted = false
        donation.to = toEntity

        await this.donationRepository.save(donation)
    }
}
