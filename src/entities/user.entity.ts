import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm'
import * as bcrypt from 'bcrypt'
import { UserWallet } from './wallet.entity'

@Entity({ name: 'user' })
export class User {
    @PrimaryGeneratedColumn('uuid')
    public id: string

    // @Column({ nullable: false })
    @CreateDateColumn({})
    public createdAt: Date

    // @Column({ nullable: false })
    @UpdateDateColumn()
    public updatedAt: Date

    @DeleteDateColumn()
    public deletedAt?: Date

    @Column({ nullable: true })
    public lastLoginAt?: Date

    @Column({
        type: 'varchar',
        length: 255,
        nullable: false,
        unique: true,
    })
    public username: string

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
    public email: string

    @Column({ nullable: false })
    isEmailVerified: boolean

    @Column({ nullable: false })
    isActive: boolean

    @OneToMany(() => UserWallet, (wallet) => wallet.user)
    wallets: UserWallet[]

    async setPassword(password: string) {
        this.password = await bcrypt.hash(password, 10)
    }

    async comparePassword(password: string) {
        return await bcrypt.compare(password, this.password)
    }
}
