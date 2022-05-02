import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UserWallet } from '../entities/wallet.entity'
import { UserService } from '../user/user.service'

@Injectable()
export class WalletService {
    constructor(
        private readonly userService: UserService,
        @InjectRepository(UserWallet)
        private readonly userWalletRepository: Repository<UserWallet>,
    ) {}

    async createWallet(
        userId: string,
        // walletType: string,
        walletAddress: string,
    ) {
        const user = await this.userService.getUserById(userId)

        if (!user) throw new BadRequestException('User not found')

        const userWallet = new UserWallet()
        userWallet.user = user
        // userWallet.type = walletType as any
        userWallet.address = walletAddress

        return await this.userWalletRepository.save(userWallet)
    }

    async getUserWallet(userId: string) {
        return this.userWalletRepository.find({ userId })
    }

    // async getUserWalletByUsername(username: string) {
    //     return this.userWalletRepository.find({
    //         where: {
    //             user: {
    //                 username,
    //             },
    //         },
    //     })
    // }

    async hasWalletAddress(userId: string, walletAddress: string) {
        const userWallet = await this.userWalletRepository.findOne({
            userId,
            address: walletAddress,
        })

        return !!userWallet
    }

    async deleteUserWallet(userId: string, walletId: string) {
        const userWallet = await this.userWalletRepository.findOne({
            userId,
            id: walletId,
        })

        if (!userWallet) {
            throw new BadRequestException('Wallet not found')
        }

        return await this.userWalletRepository.remove(userWallet)
    }
}
