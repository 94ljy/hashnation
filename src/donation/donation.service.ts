import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { DonationEntity } from './entity/donation.entity'
import { clusterApiUrl, Connection, SystemProgram } from '@solana/web3.js'
import base58 from 'bs58'
import { ns64, struct, u32 } from '@solana/buffer-layout'

const TRANSFER_INSTRUCTION_INDEX = 2

const ins = struct<{ instruction: number; lamports: number }>([
    u32('instruction'),
    ns64('lamports'),
])

@Injectable()
export class DonationService {
    private readonly solanaConn: Connection
    constructor(
        @InjectRepository(DonationEntity)
        private readonly donationRepository: Repository<DonationEntity>,
    ) {
        this.solanaConn = new Connection(clusterApiUrl('devnet'))
    }

    async donation(txSignature: string, message: string) {
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

        const parsedData = ins.decode(base58.decode(instruction.data))

        // tx not transfer instruction
        if (parsedData.instruction !== TRANSFER_INSTRUCTION_INDEX)
            throw new BadRequestException('Invalid instruction index')

        const from =
            txResponse.transaction.message.accountKeys[
                instruction.accounts[0]
            ].toString()

        const to =
            txResponse.transaction.message.accountKeys[
                instruction.accounts[1]
            ].toString()

        const lamports = parsedData.lamports

        const donation = new DonationEntity()
        donation.txSignature = txSignature
        donation.message = message
        donation.createdAt = new Date()
        donation.from = from.toString()
        donation.to = to.toString()
        donation.lamports = lamports
        donation.isConfirmed = false
        donation.isBrodcasted = false

        await this.donationRepository.save(donation)
    }
}
