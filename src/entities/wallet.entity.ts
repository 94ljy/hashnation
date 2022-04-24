import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    ManyToOne,
    PrimaryColumn,
    UpdateDateColumn,
} from 'typeorm'
import { UserEntity } from './user.entity'

// export type walletType = 'sol'

@Entity({ name: 'user_wallet' })
export class UserWalletEntity {
    @PrimaryColumn()
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

    @ManyToOne(() => UserEntity, (user) => user.wallets)
    public user: UserEntity
}
