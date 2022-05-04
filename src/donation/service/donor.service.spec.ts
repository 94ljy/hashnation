import { BadRequestException, LoggerService } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { SystemProgram } from '@solana/web3.js'
import base58 from 'bs58'
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston'
import { Repository, Transaction } from 'typeorm'
import { ConfigService } from '../../config/config.service'
import { DonationRepository } from '../../repository/donation.repository'
import {
    Donation,
    DonationStatus,
} from '../../repository/entities/donation.entity'
import { UserService } from '../../user/user.service'
import { WalletService } from '../../wallet/wallet.service'
import {
    DonorService,
    TRANSFER_INSTRUCTION,
    TRANSFER_INSTRUCTION_INDEX,
} from './donor.service'

describe('DonationService', () => {
    let donorService: DonorService
    let userService: UserService
    let eventEmitter: EventEmitter2
    let walletService: WalletService
    let configService: ConfigService
    let donationRepository: DonationRepository
    let logger: LoggerService

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide: EventEmitter2,
                    useValue: {},
                },
                {
                    provide: UserService,
                    useValue: {},
                },
                {
                    provide: WalletService,
                    useValue: {},
                },
                {
                    provide: DonationRepository,
                    useValue: {},
                },
                {
                    provide: ConfigService,
                    useValue: {
                        get: jest.fn().mockReturnValue('devnet'),
                    },
                },
                {
                    provide: WINSTON_MODULE_NEST_PROVIDER,
                    useValue: {},
                },

                DonorService,
            ],
        }).compile()

        donorService = module.get<DonorService>(DonorService)
        userService = module.get<UserService>(UserService)
        eventEmitter = module.get<EventEmitter2>(EventEmitter2)
        walletService = module.get<WalletService>(WalletService)
        configService = module.get<ConfigService>(ConfigService)
        donationRepository = module.get<DonationRepository>(DonationRepository)

        logger = module.get<LoggerService>(WINSTON_MODULE_NEST_PROVIDER)
    })

    it('should be defined', () => {
        expect(donorService).toBeDefined()
    })

    describe('getCreatorInfo', () => {
        it('should return creator info', async () => {
            const user = {
                username: 'test',
            }

            const wallets = [
                {
                    id: 1,
                    address: '0x0000000000000000000000000000000000000000',
                },
            ]

            userService.getUserByUsername = jest.fn().mockResolvedValue(user)
            walletService.getUserWallet = jest.fn().mockResolvedValue(wallets)

            const result = await donorService.getCreatorInfo('test')

            expect(result).toEqual({
                username: 'test',
                wallets: [
                    {
                        address: '0x0000000000000000000000000000000000000000',
                    },
                ],
            })
        })

        it('should throw error if user not found', async () => {
            userService.getUserByUsername = jest.fn().mockResolvedValue(null)

            const rejects = expect(donorService.getCreatorInfo('test')).rejects

            await rejects.toThrow('User test not found')
            await rejects.toThrowError(BadRequestException)
        })
    })

    describe('donate', () => {
        const toUsername = 'testUser'
        const message = 'donation test'
        const signature = 'signature'
        const from = '0x0000000000000000000000000000000000000000'
        const to = '0x0000000000000000000000000000000000000001'
        const lamports = 10000

        const rawTransaction = '1234'

        const mockTransaction = {
            serialize: jest.fn().mockReturnValue(Buffer.from([1, 2, 3])),
        }

        beforeEach(() => {
            donorService.rawTransactionToTransaction = jest
                .fn()
                .mockReturnValue(mockTransaction)

            donorService.verifyTransaction = jest.fn().mockReturnValue({
                signature: signature,
                from: from,
                to: to,
                lamports: lamports,
            })

            userService.getUserByUsername = jest.fn().mockResolvedValue({})
            walletService.hasWalletAddress = jest.fn().mockResolvedValue(true)

            donationRepository.createDonation = jest.fn().mockResolvedValue({})

            donorService.sendRawTransaction = jest
                .fn()
                .mockResolvedValue(signature)
            donorService.confirmTransaction = jest.fn().mockResolvedValue({
                value: {
                    err: null,
                },
            })

            donationRepository.updateDonationStatus = jest
                .fn()
                .mockResolvedValue({})

            eventEmitter.emit = jest.fn().mockReturnValue(true)

            logger.error = jest.fn().mockReturnValue(true)
        })

        it('donate successfully', async () => {
            // init

            // run
            const result = await donorService.donate(
                toUsername,
                rawTransaction,
                message,
            )

            // verify
            expect(donorService.rawTransactionToTransaction).toBeCalledTimes(1)
            expect(donorService.rawTransactionToTransaction).toBeCalledWith(
                rawTransaction,
            )

            expect(donorService.verifyTransaction).toBeCalledTimes(1)

            expect(userService.getUserByUsername).toBeCalledTimes(1)
            expect(walletService.hasWalletAddress).toBeCalledTimes(1)

            expect(donationRepository.createDonation).toBeCalledTimes(1)

            expect(mockTransaction.serialize).toBeCalledTimes(1)

            expect(donorService.sendRawTransaction).toBeCalledTimes(1)
            expect(donorService.confirmTransaction).toBeCalledWith(signature)

            expect(donationRepository.updateDonationStatus).toBeCalledTimes(1)

            expect(donationRepository.updateDonationStatus).toBeCalledWith(
                undefined,
                DonationStatus.APPROVED,
            )

            expect(eventEmitter.emit).toBeCalledTimes(1)

            expect(result).toEqual({
                err: null,
                tx: signature,
            })
        })

        it('donate failed toUser not found', async () => {
            userService.getUserByUsername = jest.fn().mockResolvedValue(null)

            const rejects = expect(
                donorService.donate(toUsername, rawTransaction, message),
            ).rejects

            await rejects.toThrowError(BadRequestException)
            await rejects.toThrow(`User ${toUsername} not found`)
        })

        it('donate failed toUser has no wallet', async () => {
            walletService.hasWalletAddress = jest.fn().mockResolvedValue(false)

            const rejects = expect(
                donorService.donate(toUsername, rawTransaction, message),
            ).rejects

            await rejects.toThrowError(BadRequestException)
            await rejects.toThrow(`User does not have a wallet address ${to}`)
        })

        it('donate failed tx reject', async () => {
            donorService.confirmTransaction = jest.fn().mockResolvedValue({
                value: {
                    err: 'failed',
                },
            })

            await donorService.donate(toUsername, rawTransaction, message)

            expect(donationRepository.updateDonationStatus).toBeCalledTimes(1)
            expect(donationRepository.updateDonationStatus).toBeCalledWith(
                undefined,
                DonationStatus.REJECTED,
            )
        })
    })

    // describe('verifyTransaction', () => {
    //     it('should verify transaction', async () => {
    //         const data = Buffer.alloc(4 + 8)
    //         TRANSFER_INSTRUCTION.encode(
    //             {
    //                 instruction: TRANSFER_INSTRUCTION_INDEX,
    //                 lamports: 100000,
    //             },
    //             data,
    //         )

    //         const signature = Buffer.from([0, 1, 2, 3])

    //         const transaction = {
    //             signature: signature,
    //             verifySignatures: jest.fn().mockReturnValue(true),
    //             instructions: [
    //                 {
    //                     programId: SystemProgram.programId,
    //                     data,
    //                     keys: [
    //                         '0x0000000000000000000000000000000000000000',
    //                         '0x0000000000000000000000000000000000000001',
    //                     ],
    //                 },
    //             ],
    //         } as any

    //         const result = donorService.verifyTransaction(transaction)

    //         expect(result).toBe(true)
    //     })

    //     it('should throw error if transaction signature verification failed', async () => {
    //         //
    //     })
    // })
})
