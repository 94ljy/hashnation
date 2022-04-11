import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UserEntity } from './entity/user.entity'

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRopository: Repository<UserEntity>,
    ) {}

    async createUser(username: string, publicKey: string) {
        const newUser = new UserEntity()

        newUser.username = username
        newUser.publicKey = publicKey
        newUser.createdAt = new Date()

        await this.userRopository.save(newUser)
    }

    async getUser(publicKey: string) {
        const user = await this.userRopository.findOne({
            publicKey: publicKey,
        })

        if (!user) {
            throw new NotFoundException('user not found')
        }

        return {
            id: user.id,
            publicKey: user.publicKey,
        }
    }
}
