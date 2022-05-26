import { BadRequestException, LoggerService } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { Test, TestingModule } from '@nestjs/testing'
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston'
import { ConfigService } from '../../config/config.service'
import { AppLogger } from '../../logger/logger.service'
import { DonationRepository } from '../repository/donation.repository'
import { Donation, DonationStatus } from '../domain/donation.entity'
import { UserService } from '../../user/user.service'
import { WalletService } from '../../wallet/wallet.service'
import { SolanaConnection } from '../service/sol.connection'
import { SolDonateService } from '../service/sol.donate.service'
import { DonationCreatedEvent } from '../event/donation.created.event'

describe('SolDonateService', () => {
    let solDonateService: SolDonateService
    let userService: UserService
    let eventEmitter: EventEmitter2
    let walletService: WalletService
    let configService: ConfigService
    let donationRepository: DonationRepository
    let logger: LoggerService
    let solanaConn: SolanaConnection

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
                    useValue: {},
                },

                {
                    provide: AppLogger,
                    useValue: {},
                },
                {
                    provide: SolanaConnection,
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
        solanaConn = module.get<SolanaConnection>(SolanaConnection)
        logger = module.get(AppLogger)
    })

    describe('donate', () => {
        const toUsername = 'test-user'
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
            userService.getUserByUsername = jest.fn().mockResolvedValue({})

            solDonateService.rawTransactionToTransaction = jest
                .fn()
                .mockReturnValue({
                    signature,
                    from,
                    to,
                    lamports,
                    transaction: mockTransaction,
                })

            walletService.getUserWallets = jest.fn().mockResolvedValue({
                hasWallet: jest.fn().mockReturnValue(true),
            })

            donationRepository.save = jest
                .fn()
                .mockResolvedValue(new Donation())

            solanaConn.sendRawTransaction = jest
                .fn()
                .mockResolvedValue(signature)

            solanaConn.confirmTransaction = jest.fn().mockResolvedValue({
                value: {
                    err: null,
                },
            })

            eventEmitter.emit = jest.fn().mockReturnValue(true)
            eventEmitter.emitAsync = jest.fn().mockResolvedValue([])

            logger.error = jest.fn().mockReturnValue(true)
        })

        it('donate fail username not found', async () => {
            userService.getUserByUsername = jest.fn().mockResolvedValue(null)

            await expect(
                solDonateService.donate(toUsername, rawTransaction, message),
            ).rejects.toThrow(`User ${toUsername} not found`)
        })

        it('donate fail invalid raw transaction', async () => {
            solDonateService.rawTransactionToTransaction = jest
                .fn()
                .mockImplementation(() => {
                    throw new Error('invalid raw transaction')
                })

            await expect(
                solDonateService.donate(
                    toUsername,
                    'invalide transcation',
                    message,
                ),
            ).rejects.toThrow('invalid raw transaction')
        })

        it('donate fail user wallet not found', async () => {
            walletService.getUserWallets = jest.fn().mockResolvedValue({
                hasWallet: jest.fn().mockReturnValue(false),
            })

            await expect(
                solDonateService.donate(toUsername, rawTransaction, message),
            ).rejects.toThrow(`User does not have a wallet address ${to}`)
        })

        it('donate success', async () => {
            await expect(
                solDonateService.donate(toUsername, rawTransaction, message),
            ).resolves.not.toThrow()
        })

        it('donate success and event check', async () => {
            await expect(
                solDonateService.donate(toUsername, rawTransaction, message),
            ).resolves.not.toThrow()

            expect(eventEmitter.emitAsync).toBeCalledTimes(2)
            expect(eventEmitter.emitAsync).toHaveBeenNthCalledWith(
                1,
                DonationCreatedEvent.name,
                expect.anything(),
            )
        })
    })
})
