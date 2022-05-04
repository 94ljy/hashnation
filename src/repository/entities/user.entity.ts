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
import { Wallet } from './wallet.entity'

@Entity({ name: 'user' })
export class User {
    @PrimaryGeneratedColumn('uuid', { name: 'id' })
    public id: string

    // @Column({ nullable: false })
    @CreateDateColumn({ name: 'created_at' })
    public createdAt: Date

    // @Column({ nullable: false })
    @UpdateDateColumn({ name: 'updated_at' })
    public updatedAt: Date

    @DeleteDateColumn({ name: 'deleted_at' })
    public deletedAt?: Date

    @Column({ nullable: true, name: 'last_login_at' })
    public lastLoginAt?: Date

    @Column({
        type: 'varchar',
        length: 255,
        nullable: false,
        unique: true,
        name: 'username',
    })
    public username: string

    @Column({
        type: 'varchar',
        length: 255,
        nullable: false,
        name: 'password',
    })
    private password: string

    @Column({
        type: 'varchar',
        length: 255,
        nullable: false,
        unique: true,
        name: 'email',
    })
    public email: string

    @Column({ nullable: false, name: 'is_email_verified' })
    isEmailVerified: boolean

    @Column({ nullable: false, name: 'is_active' })
    isActive: boolean

    @OneToMany(() => Wallet, (wallet) => wallet.user)
    wallets: Wallet[]

    async setPassword(password: string) {
        this.password = await bcrypt.hash(password, 10)
    }

    async comparePassword(password: string) {
        return await bcrypt.compare(password, this.password)
    }
}
