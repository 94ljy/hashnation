import { BadRequestException, LoggerService } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { Test, TestingModule } from '@nestjs/testing'
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston'
import { ConfigService } from '../../config/config.service'
import { AppLogger } from '../../logger/logger.service'
import { DonationRepository } from '../../repository/donation.repository'
import { DonationStatus } from '../../repository/entities/donation.entity'
import { UserService } from '../../user/user.service'
import { WalletService } from '../../wallet/wallet.service'
import { SolDonateService } from './sol.donate.service'
import { SolTransferService } from './sol.transfer.service'

describe('SolDonateService', () => {
    let solDonateService: SolDonateService
    let userService: UserService
    let eventEmitter: EventEmitter2
    let walletService: WalletService
    let configService: ConfigService
    let donationRepository: DonationRepository
    let logger: LoggerService
    let solTransferService: SolTransferService

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
                    provide: SolTransferService,
                    useValue: {},
                },
                {
                    provide: AppLogger,
                    useValue: {},
                },
                SolDonateService,
            ],
        }).compile()

        solDonateService = module.get<SolDonateService>(SolDonateService)
        userService = module.get<UserService>(UserService)
        eventEmitter = module.get<EventEmitter2>(EventEmitter2)
        walletService = module.get<WalletService>(WalletService)
        configService = module.get<ConfigService>(ConfigService)
        donationRepository = module.get<DonationRepository>(DonationRepository)
        solTransferService = module.get<SolTransferService>(SolTransferService)

        logger = module.get<AppLogger>(AppLogger)
    })

    it('should be defined', () => {
        expect(solDonateService).toBeDefined()
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
            solDonateService.rawTransactionToTransaction = jest
                .fn()
                .mockReturnValue(mockTransaction)

            solTransferService.unpack = jest.fn().mockReturnValue({
                signature: signature,
                from: from,
                to: to,
                lamports: lamports,
            })

            userService.getUserByUsername = jest.fn().mockResolvedValue({})
            walletService.hasWalletAddress = jest.fn().mockResolvedValue(true)

            donationRepository.createDonation = jest.fn().mockResolvedValue({})

            solDonateService.sendRawTransaction = jest
                .fn()
                .mockResolvedValue(signature)
            solDonateService.confirmTransaction = jest.fn().mockResolvedValue({
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
            const result = await solDonateService.donate(
                toUsername,
                rawTransaction,
                message,
            )

            // verify
            expect(
                solDonateService.rawTransactionToTransaction,
            ).toBeCalledTimes(1)
            expect(solDonateService.rawTransactionToTransaction).toBeCalledWith(
                rawTransaction,
            )

            expect(solTransferService.unpack).toBeCalledTimes(1)

            expect(userService.getUserByUsername).toBeCalledTimes(1)
            expect(walletService.hasWalletAddress).toBeCalledTimes(1)

            expect(donationRepository.createDonation).toBeCalledTimes(1)

            expect(mockTransaction.serialize).toBeCalledTimes(1)

            expect(solDonateService.sendRawTransaction).toBeCalledTimes(1)
            expect(solDonateService.confirmTransaction).toBeCalledWith(
                signature,
            )

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
                solDonateService.donate(toUsername, rawTransaction, message),
            ).rejects

            await rejects.toThrowError(BadRequestException)
            await rejects.toThrow(`User ${toUsername} not found`)
        })

        it('donate failed toUser has no wallet', async () => {
            walletService.hasWalletAddress = jest.fn().mockResolvedValue(false)

            const rejects = expect(
                solDonateService.donate(toUsername, rawTransaction, message),
            ).rejects

            await rejects.toThrowError(BadRequestException)
            await rejects.toThrow(`User does not have a wallet address ${to}`)
        })

        it('donate failed tx reject', async () => {
            solDonateService.confirmTransaction = jest.fn().mockResolvedValue({
                value: {
                    err: 'failed',
                },
            })

            await solDonateService.donate(toUsername, rawTransaction, message)

            expect(donationRepository.updateDonationStatus).toBeCalledTimes(1)
            expect(donationRepository.updateDonationStatus).toBeCalledWith(
                undefined,
                DonationStatus.REJECTED,
            )
        })
    })
})
