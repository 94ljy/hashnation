import { Test } from '@nestjs/testing'
import {
    Keypair,
    LAMPORTS_PER_SOL,
    SystemProgram,
    Transaction,
} from '@solana/web3.js'
import * as base58 from 'bs58'
import { SolTransferTransaction } from '../service/sol.transfer.transaction'

describe('solTransferTransaction', () => {
    const fromKeypair = Keypair.generate()
    const toKeypair = Keypair.generate()
    const blockHash = '9hChvegHv4hmMJWbicQ8Js262oCsiDW2SX9ZFwHbUpua'
    let transaction: Transaction

    beforeEach(() => {
        transaction = new Transaction()
        transaction.add(
            SystemProgram.transfer({
                fromPubkey: fromKeypair.publicKey,
                toPubkey: toKeypair.publicKey,
                lamports: LAMPORTS_PER_SOL,
            }),
        )
        transaction.feePayer = fromKeypair.publicKey
        transaction.recentBlockhash = blockHash
    })

    it('valide transaction', () => {
        transaction.sign(fromKeypair)

        const solTransferTransaction =
            SolTransferTransaction.fromRawTransaction(
                base58.encode(transaction.serialize()),
            )

        expect(solTransferTransaction.from).toEqual(
            fromKeypair.publicKey.toString(),
        )
        expect(solTransferTransaction.to).toEqual(
            toKeypair.publicKey.toString(),
        )
        expect(solTransferTransaction.lamports).toEqual(LAMPORTS_PER_SOL)
    })

    describe('failure', () => {
        it('invalid transaction', () => {
            expect(() =>
                SolTransferTransaction.fromRawTransaction(
                    'invalid transaction',
                ),
            ).toThrow()
        })

        it('unsigned transaction', () => {
            expect(() =>
                SolTransferTransaction.fromRawTransaction(
                    base58.encode(
                        transaction.serialize({
                            requireAllSignatures: false,
                            verifySignatures: false,
                        }),
                    ),
                ),
            ).toThrow('Transaction signature verification failed')
        })

        it('invalide instruction length', () => {
            transaction.instructions.push(transaction.instructions[0])

            transaction.sign(fromKeypair)

            expect(() =>
                SolTransferTransaction.fromRawTransaction(
                    base58.encode(transaction.serialize()),
                ),
            ).toThrowError('Invalid number of instructions')
        })

        it('invalid programId', () => {
            transaction.instructions[0].programId = Keypair.generate().publicKey

            transaction.sign(fromKeypair)

            expect(() =>
                SolTransferTransaction.fromRawTransaction(
                    base58.encode(transaction.serialize()),
                ),
            ).toThrowError('Invalid programId')
        })

        it('invalid instruction index', () => {
            // instruction override
            transaction.instructions[0].data.writeUint32LE(99)

            transaction.sign(fromKeypair)

            expect(() =>
                SolTransferTransaction.fromRawTransaction(
                    base58.encode(transaction.serialize()),
                ),
            ).toThrowError('Invalid instruction index')
        })

        it('invalid number of keys', () => {
            transaction.instructions[0].keys.push(
                transaction.instructions[0].keys[0],
            )

            transaction.sign(fromKeypair)

            expect(() =>
                SolTransferTransaction.fromRawTransaction(
                    base58.encode(transaction.serialize()),
                ),
            ).toThrowError('Invalid number of keys')
        })
    })
})
