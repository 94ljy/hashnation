import { AbstractRepository, EntityRepository, Repository } from 'typeorm'
import { User } from './entities/user.entity'

@EntityRepository(User)
export class UserRepository extends AbstractRepository<User> {
    async createUser(user: User) {
        return this.repository.save(user)
    }

    async findUserById(userId: string): Promise<User | null> {
        return (await this.repository.findOne(userId)) ?? null
    }

    async findUserByUsername(username: string): Promise<User | null> {
        return (await this.repository.findOne({ username })) ?? null
    }

    async updateUserLastLogin(userId: string, date: Date) {
        return this.repository.update(userId, { lastLoginAt: date })
    }
}
