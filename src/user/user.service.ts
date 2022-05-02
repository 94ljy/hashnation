import {
    BadRequestException,
    Inject,
    Injectable,
    LoggerService,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from 'src/entities/user.entity'
import { Repository } from 'typeorm'
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston'
import { ConfigService } from '../config/config.service'

@Injectable()
export class UserService {
    constructor(
        private readonly configService: ConfigService,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @Inject(WINSTON_MODULE_NEST_PROVIDER)
        private readonly logger: LoggerService,
    ) {}

    async createUser(username: string, password: string, email: string) {
        const findedUser = this.getUserByUsername(username)

        if (findedUser === null) {
            throw new BadRequestException(`Username ${username} already exists`)
        }

        const user = new User()
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

    async getUserById(userId: string): Promise<User | null> {
        return (await this.userRepository.findOne(userId)) ?? null
    }

    async getUserByUsername(username: string): Promise<User | null> {
        return (await this.userRepository.findOne({ username })) ?? null
    }

    async getUserInfo(userId: string) {
        const user = await this.getUserById(userId)

        if (!user) throw new BadRequestException(`User ${userId} not found`)

        const serverUrl = this.configService.get('SERVER_URL')

        return {
            donateUrl: `http://${serverUrl}/donate/${user.username}`,
            widgetUrl: `http://${serverUrl}/widget/${user.username}`,
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
