import { BadRequestException } from '@nestjs/common'
import { ns64, struct, u32 } from '@solana/buffer-layout'
import { SystemProgram, Transaction } from '@solana/web3.js'
import base58 from 'bs58'

const TRANSFER_INSTRUCTION_INDEX = 2

const TRANSFER_INSTRUCTION = struct<{
    instruction: number
    lamports: number
}>([u32('instruction'), ns64('lamports')])

export class SolTransferTransaction {
    private constructor(
        public signature: string,
        public from: string,
        public to: string,
        public lamports: number,
        public transaction: Transaction,
    ) {}

    public static fromRawTransaction(rawTransaction: string) {
        const transaction = Transaction.from(base58.decode(rawTransaction))

        if (transaction.signature === null || !transaction.verifySignatures()) {
            throw new Error('Transaction signature verification failed')
        }

        // tx validations
        if (transaction.instructions.length !== 1) {
            throw new Error('Invalid number of instructions')
        }

        const instruction = transaction.instructions[0]

        // tx validations
        if (!SystemProgram.programId.equals(instruction.programId)) {
            throw new Error('Invalid programId')
        }

        const parsedData = TRANSFER_INSTRUCTION.decode(instruction.data)

        // tx validations
        if (parsedData.instruction !== TRANSFER_INSTRUCTION_INDEX) {
            throw new Error('Invalid instruction index')
        }

        // tx validations
        if (instruction.keys.length !== 2) {
            throw new Error('Invalid number of keys')
        }

        const signature = base58.encode(transaction.signature)
        const from = instruction.keys[0].pubkey.toString()
        const to = instruction.keys[1].pubkey.toString()
        const lamports = parsedData.lamports

        return new SolTransferTransaction(
            signature,
            from,
            to,
            lamports,
            transaction,
        )
    }
}
