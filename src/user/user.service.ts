import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UserEntity } from 'src/entities/user.entity'
import { Repository } from 'typeorm'

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
    ) {}

    async createUser(username: string, password: string, email: string) {
        const user = new UserEntity()
        user.username = username
        await user.setPassword(password)
        user.email = email
        user.isEmailVerified = false
        user.isActive = true
        return await this.userRepository.save(user)
    }

    async getUserById(userId: string) {
        return this.userRepository.findOneOrFail(userId)
    }

    async getUserByUsername(username: string) {
        return this.userRepository.findOneOrFail({ username })
    }

    async getUserInfo(userId: string) {
        const user = await this.getUserById(userId)

        return {
            donateUrl: `http://localhost:3000/donate/${user.username}`,
            widgetUrl: `http://localhost:3000/widget/${user.username}`,
        }
    }
}
