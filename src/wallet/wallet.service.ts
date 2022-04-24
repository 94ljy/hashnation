import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UserWalletEntity } from '../entities/wallet.entity'
import { UserService } from '../user/user.service'

@Injectable()
export class WalletService {
    constructor(
        private readonly userService: UserService,
        @InjectRepository(UserWalletEntity)
        private readonly userWalletRepository: Repository<UserWalletEntity>,
    ) {}

    async createWallet(
        userId: string,
        // walletType: string,
        walletAddress: string,
    ) {
        const user = await this.userService.getUserById(userId)

        const userWallet = new UserWalletEntity()
        userWallet.user = user
        // userWallet.type = walletType as any
        userWallet.address = walletAddress

        await this.userWalletRepository.save(userWallet)
    }

    async getUserWallet(userId: string) {
        return this.userWalletRepository.findOneOrFail({ userId })
    }

    async hasWalletAddress(userId: string, walletAddress: string) {
        const userWallet = await this.userWalletRepository.findOne({
            userId,
            address: walletAddress,
        })

        return !!userWallet
    }
}
