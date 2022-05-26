import { BadRequestException, Injectable } from '@nestjs/common'
import { PublicKey } from '@solana/web3.js'
import base58 from 'bs58'
import nacl from 'tweetnacl'
import { CURRENCY_TYPE } from '../common/currency'
import { Wallet } from './domain/wallet.entity'
import { WalletRepository } from './repository/wallet.repository'
import { UserService } from '../user/user.service'
import { UserWallets } from './domain/user.wallet'

@Injectable()
export class WalletService {
    constructor(
        private readonly userService: UserService,
        private readonly walletRepository: WalletRepository,
    ) {}

    async createWallet(
        userId: string,
        currency: CURRENCY_TYPE,
        walletAddress: string,
        signature: string,
    ) {
        const userWallets = await this.getUserWallets(userId)

        if (userWallets.hasCurrency(currency)) {
            throw new BadRequestException('User already has a wallet')
        }

        const newWallet = Wallet.createWallet(
            CURRENCY_TYPE.SOL,
            walletAddress,
            userId,
        )

        newWallet.validate(signature)

        return await this.walletRepository.save(newWallet)
    }

    async getUserWallets(userId: string): Promise<UserWallets> {
        const wallets = await this.walletRepository.find({
            where: { userId: userId },
        })
        return new UserWallets(userId, wallets)
    }

    async deleteUserWallet(userId: string, walletId: string) {
        const userWallet = await this.walletRepository.findOne({
            where: {
                userId: userId,
                id: walletId,
            },
        })

        if (!userWallet) throw new BadRequestException('Wallet not found')

        userWallet.delete()

        return await this.walletRepository.save(userWallet)
    }
}
