import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common'
import { User } from './domain/user.entity'
import { ConfigService } from '../config/config.service'
import { UserRepository } from './repository/user.repository'
import { AppLogger } from '../logger/logger.service'

@Injectable()
export class UserService {
    serverUrl: string
    constructor(
        private readonly configService: ConfigService,
        private readonly logger: AppLogger,
        private readonly userRepository: UserRepository,
    ) {
        this.serverUrl = this.configService.get('SERVER_URL') as string
    }

    async createUser(username: string, password: string, email: string) {
        const foundUser = await this.getUserByUsername(username)

        if (foundUser !== undefined) {
            throw new BadRequestException(`Username ${username} already exists`)
        }

        const user = new User()
        user.username = username
        await user.setPassword(password)
        user.email = email
        user.isEmailVerified = false
        user.isActive = true

        return await this.userRepository
            .save(user)
            .then((newUser) => {
                this.logger.log(`Created user ${newUser.username}`)
                return newUser
            })
            .catch((err) => {
                this.logger.error(`Error creating user ${username}`)
                this.logger.error(err)

                throw new InternalServerErrorException('Error creating user')
            })
    }

    async getUserById(userId: string): Promise<User | null> {
        return (await this.userRepository.findOne(userId)) ?? null
    }

    async getUserByUsername(username: string): Promise<User | null> {
        return (
            (await this.userRepository.findOne({ where: { username } })) ?? null
        )
    }

    async getUserInfo(userId: string) {
        const user = await this.getUserById(userId)

        if (!user) throw new BadRequestException(`User ${userId} not found`)

        return {
            donateUrl: `http://${this.serverUrl}/donate/${user.username}`,
            widgetUrl: `http://${this.serverUrl}/widget/${user.username}`,
        }
    }

    async updateUserLastLogin(userId: string) {
        try {
            const user = await this.getUserById(userId)
            if (user === null)
                throw new BadRequestException(`User ${userId} not found`)

            user.updateLastLoginAt()

            await this.userRepository.save(user)
            this.logger.log(`Updated last login for user ${userId}`)
        } catch (err) {
            this.logger.error(`Error updating user ${userId} last login`)
            this.logger.error(err)
        }
    }
}
