import {
    BadRequestException,
    Inject,
    Injectable,
    InternalServerErrorException,
    LoggerService,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from '../repository/entities/user.entity'
import { Repository } from 'typeorm'
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston'
import { ConfigService } from '../config/config.service'
import { UserRepository } from '../repository/user.repository'

@Injectable()
export class UserService {
    serverUrl: string
    constructor(
        private readonly configService: ConfigService,
        @Inject(WINSTON_MODULE_NEST_PROVIDER)
        private readonly logger: LoggerService,
        private readonly userRepository: UserRepository,
    ) {
        this.serverUrl = this.configService.get('SERVER_URL') as string
    }

    async createUser(username: string, password: string, email: string) {
        const foundUser = this.userRepository.findUserByUsername(username)

        if (foundUser === null) {
            throw new BadRequestException(`Username ${username} already exists`)
        }

        const user = new User()
        user.username = username
        await user.setPassword(password)
        user.email = email
        user.isEmailVerified = false
        user.isActive = true

        try {
            const newUser = await this.userRepository.createUser(user)
            this.logger.log(`Created user ${username}`)
            return newUser
        } catch (err) {
            this.logger.error(`Error creating user ${username}`)
            this.logger.error(err)

            throw new InternalServerErrorException('Error creating user')
        }
    }

    async getUserById(userId: string): Promise<User | null> {
        return this.userRepository.findUserById(userId)
    }

    async getUserByUsername(username: string): Promise<User | null> {
        return this.userRepository.findUserByUsername(username)
    }

    async getUserInfo(userId: string) {
        const user = await this.userRepository.findUserById(userId)

        if (!user) throw new BadRequestException(`User ${userId} not found`)

        return {
            donateUrl: `http://${this.serverUrl}/donate/${user.username}`,
            widgetUrl: `http://${this.serverUrl}/widget/${user.username}`,
        }
    }

    async updateUserLastLogin(userId: string) {
        try {
            await this.userRepository.updateUserLastLogin(userId, new Date())
            this.logger.log(`Updated last login for user ${userId}`)
        } catch (err) {
            this.logger.error(`Error updating user ${userId} last login`)
            this.logger.error(err)
        }
    }
}
