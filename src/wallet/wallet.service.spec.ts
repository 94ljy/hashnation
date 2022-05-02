import { BadRequestException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Keypair, PublicKey } from '@solana/web3.js'
import base58 from 'bs58'
import { randomUUID } from 'crypto'
import nacl from 'tweetnacl'
import { Repository } from 'typeorm'
import { UserWallet } from '../entities/wallet.entity'
import { UserService } from '../user/user.service'
import { CREATE_USER_WALLSET_MESSAGE, WalletService } from './wallet.service'

describe('WalletService', () => {
    let walletService: WalletService
    let userService: UserService
    let userWalletRepository: Repository<UserWallet>

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide: UserService,
                    useValue: {
                        getUserById: jest.fn(),
                    },
                },
                {
                    provide: getRepositoryToken(UserWallet),
                    useValue: {},
                },
                WalletService,
            ],
        }).compile()

        walletService = module.get<WalletService>(WalletService)
        userService = module.get<UserService>(UserService)
        userWalletRepository = module.get<Repository<UserWallet>>(
            getRepositoryToken(UserWallet),
        )
    })

    describe('createWallet', () => {
        //
        const userId = '0000-0000-0000-0000'
        const { publicKey, secretKey } = Keypair.generate()
        const signature = base58.encode(
            nacl.sign.detached(CREATE_USER_WALLSET_MESSAGE, secretKey),
        )

        it('user create wallet success', async () => {
            userService.getUserById = jest.fn().mockResolvedValue({
                id: userId,
            })

            walletService.getUserWallet = jest.fn().mockResolvedValue([])

            userWalletRepository.save = jest.fn().mockResolvedValue(null)

            await walletService.createWallet(
                userId,
                publicKey.toString(),
                signature,
            )

            expect(walletService.getUserWallet).toBeCalledTimes(1)
            expect(walletService.getUserWallet).toBeCalledWith(userId)

            expect(userWalletRepository.save).toBeCalledTimes(1)
            expect(userWalletRepository.save).toBeCalledWith({
                address: publicKey.toString(),
                user: {
                    id: userId,
                },
            })
        })

        it('user already has a wallet', async () => {
            userService.getUserById = jest.fn().mockResolvedValue({
                id: userId,
            })

            walletService.getUserWallet = jest.fn().mockResolvedValue([
                {
                    address: publicKey.toString(),
                },
            ])

            await expect(
                walletService.createWallet(
                    userId,
                    publicKey.toString(),
                    signature,
                ),
            ).rejects.toThrowError(BadRequestException)
        })

        it('invalide public key', async () => {
            userService.getUserById = jest.fn().mockResolvedValue({
                id: userId,
            })

            await expect(
                walletService.createWallet(
                    userId,
                    'invalid-public-key',
                    signature,
                ),
            ).rejects.toThrowError(BadRequestException)

            await expect(
                walletService.createWallet(
                    userId,
                    'invalid-public-key',
                    signature,
                ),
            ).rejects.toThrow('Invalid wallet address')
        })

        it('invalide signature', async () => {
            userService.getUserById = jest.fn().mockResolvedValue({
                id: userId,
            })

            walletService.getUserWallet = jest.fn().mockResolvedValue([])

            userWalletRepository.save = jest.fn().mockResolvedValue(null)

            await expect(
                walletService.createWallet(
                    userId,
                    publicKey.toString(),
                    'invalid-signature',
                ),
            ).rejects.toThrowError(BadRequestException)

            await expect(
                walletService.createWallet(
                    userId,
                    publicKey.toString(),
                    base58.encode(Buffer.from([1, 2, 3])),
                ),
            ).rejects.toThrow('Invalid signature')
        })
    })
})
