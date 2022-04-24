import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm'
import * as bcrypt from 'bcrypt'

@Entity({ name: 'user' })
export class UserEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    // @Column({ nullable: false })
    @CreateDateColumn({})
    createdAt: Date

    // @Column({ nullable: false })
    @UpdateDateColumn()
    updatedAt: Date

    @DeleteDateColumn()
    deletedAt?: Date | null

    @Column({
        type: 'varchar',
        length: 255,
        nullable: false,
        unique: true,
    })
    username: string

    @Column({
        type: 'varchar',
        length: 255,
        nullable: false,
    })
    private password: string

    @Column({
        type: 'varchar',
        length: 255,
        nullable: false,
        unique: true,
    })
    email: string

    @Column({ nullable: false })
    isEmailVerified: boolean

    @Column({ nullable: false })
    isActive: boolean

    async setPassword(password: string) {
        this.password = await bcrypt.hash(password, 10)
    }

    async comparePassword(password: string) {
        return await bcrypt.compare(password, this.password)
    }
}
