import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UserEntity, userUniqueKeys } from './entity/user.entity'

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRopository: Repository<UserEntity>,
    ) {}

    async createUser(publicKey: string) {
        const newUser = new UserEntity()

        newUser.username = publicKey
        newUser.publicKey = publicKey
        newUser.createdAt = new Date()

        await this.userRopository.save(newUser)
    }

    async getUser(key: userUniqueKeys, value: string) {
        const user = await this.userRopository.findOneOrFail({
            [key]: value,
        })

        return {
            id: user.id,
            publicKey: user.publicKey,
            username: user.username,
            createdAt: user.createdAt,
            lastLoginAt: user.lastLoginAt,
        }
    }

    // async getUserById(id: string) {
    //     const user = await this.userRopository.findOneOrFail({
    //         id: id,
    //     })

    //     return {
    //         id: user.id,
    //         publicKey: user.publicKey,
    //     }
    // }

    // async getUser(publicKey: string) {
    //     const user = await this.userRopository.findOneOrFail({
    //         publicKey: publicKey,
    //     })

    //     return {
    //         id: user.id,
    //         publicKey: user.publicKey,
    //     }
    // }
}
