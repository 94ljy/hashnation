import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { PublicKey } from '@solana/web3.js'
import base58 from 'bs58'
import nacl from 'tweetnacl'
import { Repository } from 'typeorm'
import { UserWallet } from '../entities/wallet.entity'
import { UserService } from '../user/user.service'

export const CREATE_USER_WALLSET_MESSAGE = new TextEncoder().encode(
    'Approve Add Wallet',
)

@Injectable()
export class WalletService {
    constructor(
        private readonly userService: UserService,
        @InjectRepository(UserWallet)
        private readonly userWalletRepository: Repository<UserWallet>,
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

        const userWallet = new UserWallet()
        userWallet.user = user
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

        if (!userWallet) throw new BadRequestException('Wallet not found')

        userWallet.deletedAt = new Date()

        return await this.userWalletRepository.save(userWallet)
    }
}
