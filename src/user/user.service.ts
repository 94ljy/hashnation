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

    async getUserById(id: string) {
        return this.userRepository.findOne(id)
    }

    async getUserByUsername(username: string) {
        return this.userRepository.findOne({ username })
    }
}
