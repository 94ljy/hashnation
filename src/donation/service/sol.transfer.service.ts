import { BadRequestException, Injectable } from '@nestjs/common'
import { ns64, struct, u32 } from '@solana/buffer-layout'
import { SystemProgram, Transaction } from '@solana/web3.js'
import base58 from 'bs58'
import { AppLogger } from '../../logger/logger.service'

export const TRANSFER_INSTRUCTION_INDEX = 2

export const TRANSFER_INSTRUCTION = struct<{
    instruction: number
    lamports: number
}>([u32('instruction'), ns64('lamports')])

@Injectable()
export class SolTransferService {
    constructor(private readonly logger: AppLogger) {}

    unpack(transaction: Transaction) {
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
}
