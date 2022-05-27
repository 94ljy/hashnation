import { Transaction, SystemInstruction } from '@solana/web3.js'
import base58 from 'bs58'
import { CURRENCY_TYPE } from 'src/common/currency'
import { Payment } from '../domain/payment.entity'

export class SolTransferTransaction {
    private constructor(
        public readonly signature: string,
        public readonly from: string,
        public readonly to: string,
        public readonly lamports: number,
        public readonly transaction: Transaction,
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

        const result = SystemInstruction.decodeTransfer(instruction)

        const signature = base58.encode(transaction.signature)
        const from = result.fromPubkey.toString()
        const to = result.toPubkey.toString()
        const lamports = result.lamports

        return new SolTransferTransaction(
            signature,
            from,
            to,
            lamports,
            transaction,
        )
    }

    toPayment(donationId: string, userId: string): Payment {
        return Payment.createPenndingPayment(
            CURRENCY_TYPE.SOL,
            this.signature,
            this.lamports,
            donationId,
            userId,
        )
    }
}
