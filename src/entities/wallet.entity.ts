import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    ManyToOne,
    PrimaryColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm'
import { User } from './user.entity'

// export type walletType = 'sol'

@Entity({ name: 'user_wallet' })
export class UserWallet {
    @PrimaryGeneratedColumn('uuid')
    public id: string

    // @Column({ nullable: false })
    @CreateDateColumn({})
    public createdAt: Date

    // @Column({ nullable: false })
    @UpdateDateColumn()
    public updatedAt: Date

    @DeleteDateColumn()
    public deletedAt?: Date | null

    // @Column()
    // public type: walletType

    @Column()
    public address: string

    @Column()
    public userId: string

    @ManyToOne(() => User, (user) => user.wallets)
    public user: User
}
