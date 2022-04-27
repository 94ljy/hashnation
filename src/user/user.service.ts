import { Inject, Injectable, LoggerService } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UserEntity } from 'src/entities/user.entity'
import { Repository } from 'typeorm'
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston'

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        @Inject(WINSTON_MODULE_NEST_PROVIDER)
        private readonly logger: LoggerService,
    ) {}

    async createUser(username: string, password: string, email: string) {
        const user = new UserEntity()
        user.username = username
        await user.setPassword(password)
        user.email = email
        user.isEmailVerified = false
        user.isActive = true

        try {
            const newUser = await this.userRepository.save(user)
            this.logger.log(`Created user ${username}`)
            return newUser
        } catch (err) {
            this.logger.error(`Error creating user ${username}`)
            this.logger.error(err)
        }
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
            donateUrl: `http://localhost:8080/donate/${user.username}`,
            widgetUrl: `http://localhost:8080/widget/${user.username}`,
        }
    }

    async updateUserLastLogin(userId: string) {
        try {
            await this.userRepository.update(userId, {
                lastLoginAt: new Date(),
            })
            this.logger.log(`Updated last login for user ${userId}`)
        } catch (err) {
            this.logger.error(`Error updating user ${userId} last login`)
            this.logger.error(err)
        }
    }
}
