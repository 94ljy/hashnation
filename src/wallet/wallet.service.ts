import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { PublicKey } from '@solana/web3.js'
import base58 from 'bs58'
import nacl from 'tweetnacl'
import { Repository } from 'typeorm'
import { Wallet } from '../repository/entities/wallet.entity'
import { WalletRepository } from '../repository/wallet.repository'
import { UserService } from '../user/user.service'

export const CREATE_USER_WALLSET_MESSAGE = new TextEncoder().encode(
    'Approve Add Wallet',
)

@Injectable()
export class WalletService {
    constructor(
        private readonly userService: UserService,
        private readonly walletRepository: WalletRepository,
    ) {}

    async createWallet(
        userId: string,
        walletAddress: string,
        signature: string,
    ) {
        const user = await this.userService.getUserById(userId)

        if (!user) throw new BadRequestException('User not found')

        try {
            new PublicKey(base58.decode(walletAddress))
        } catch (e) {
            throw new BadRequestException('Invalid wallet address')
        }

        try {
            const isValidSignature = nacl.sign.detached.verify(
                CREATE_USER_WALLSET_MESSAGE,
                base58.decode(signature),
                base58.decode(walletAddress),
            )
            if (!isValidSignature) throw new Error()
        } catch (e) {
            throw new BadRequestException('Invalid signature')
        }

        const userWalletList = await this.getUserWallet(userId)

        if (userWalletList.length > 0) {
            throw new BadRequestException('User already has a wallet')
        }

        const userWallet = new Wallet()
        userWallet.user = user
        userWallet.address = walletAddress

        return await this.walletRepository.createWallet(userWallet)
    }

    async getUserWallet(userId: string) {
        return this.walletRepository.findWalletByUserId(userId)
    }

    async hasWalletAddress(userId: string, walletAddress: string) {
        const wallet = await this.walletRepository.findWalletByAddress(
            userId,
            walletAddress,
        )

        return !!wallet
    }

    async deleteUserWallet(userId: string, walletId: string) {
        // this.walletRepository.findWalletByAddress(userId, walletId)
        const userWallet = await this.walletRepository.findWalletByWalletId(
            userId,
            walletId,
        )

        if (!userWallet) throw new BadRequestException('Wallet not found')

        return await this.walletRepository.updateWalletDeletedAt(
            userWallet.id,
            new Date(),
        )
    }
}
