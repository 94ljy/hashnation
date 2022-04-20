import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import base58 from 'bs58'
import nacl from 'tweetnacl'
import { Repository } from 'typeorm'
import { CreatorEntity, creatorUniqueKey } from './entity/creator.entity'
import { CreatorWalletEntity, walletType } from './entity/wallet.entity'

@Injectable()
export class CreatorService {
    constructor(
        @InjectRepository(CreatorEntity)
        private readonly creatorRepository: Repository<CreatorEntity>,
        @InjectRepository(CreatorWalletEntity)
        private readonly creatorWalletRepository: Repository<CreatorWalletEntity>,
    ) {}

    async createCreator(userId: string, username: string) {
        const creator = await this.creatorRepository.findOne({
            where: {
                username: username,
            },
        })

        if (creator) throw new BadRequestException('invalide username')

        const newCreator = new CreatorEntity()

        newCreator.id = userId
        newCreator.username = username
        newCreator.createdAt = new Date()

        await this.creatorRepository.save(newCreator)
    }

    async getCreator(key: creatorUniqueKey, value: string) {
        const creator = await this.creatorRepository.findOne({
            where: {
                [key]: value,
            },
        })

        if (!creator)
            throw new NotFoundException('user not found ' + key + ': ' + value)

        return creator
    }

    async addCreatorWallet(
        userId: string,
        walletType: walletType,
        walletAddress: string,
        addressSignature: string,
    ) {
        if (
            !nacl.sign.detached.verify(
                new TextEncoder().encode(walletAddress),
                base58.decode(addressSignature),
                new TextEncoder().encode(walletAddress),
            )
        )
            throw new BadRequestException('invalide address signature')

        const newCreatorWallet = new CreatorWalletEntity()

        newCreatorWallet.type = walletType
        newCreatorWallet.address = walletAddress
        newCreatorWallet.creatorId = userId
        newCreatorWallet.createdAt = new Date()

        await this.creatorWalletRepository.save(newCreatorWallet)
    }

    async getCreatorWallet(key: creatorUniqueKey, value: string) {
        return this.creatorWalletRepository.find({
            where: {
                creator: {
                    [key]: value,
                },
            },
        })
    }
}
