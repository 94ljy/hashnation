import { BadRequestException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { UserService } from '../../user/user.service'
import { WalletService } from '../../wallet/wallet.service'
import { DonorService } from '../service/donor.service'

describe('SolDonateService', () => {
    let donorService: DonorService
    let userService: UserService
    let walletService: WalletService
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide: UserService,
                    useValue: {},
                },
                {
                    provide: WalletService,
                    useValue: {},
                },
                DonorService,
            ],
        }).compile()

        donorService = module.get(DonorService)
        userService = module.get(UserService)
        walletService = module.get(WalletService)
    })

    // it('should be defined', () => {
    //     expect(donorService).toBeDefined()
    // })

    // describe('getCreatorInfo', () => {
    //     it('should return creator info', async () => {
    //         const user = {
    //             username: 'test',
    //         }

    //         const wallets = [
    //             {
    //                 id: 1,
    //                 address: '0x0000000000000000000000000000000000000000',
    //             },
    //         ]

    //         userService.getUserByUsername = jest.fn().mockResolvedValue(user)
    //         walletService.getUserWallets = jest.fn().mockResolvedValue(wallets)

    //         const result = await donorService.getCreatorInfo('test')

    //         expect(result).toEqual({
    //             username: 'test',
    //             wallets: [
    //                 {
    //                     address: '0x0000000000000000000000000000000000000000',
    //                 },
    //             ],
    //         })
    //     })

    //     it('should throw error if user not found', async () => {
    //         userService.getUserByUsername = jest.fn().mockResolvedValue(null)

    //         const rejects = expect(donorService.getCreatorInfo('test')).rejects

    //         await rejects.toThrow('User test not found')
    //         await rejects.toThrowError(BadRequestException)
    //     })
    // })
})
