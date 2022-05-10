import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    Index,
    ManyToOne,
    PrimaryColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm'
import { CURRENCY_TYPE } from '../../common/currency'
import { User } from './user.entity'

// export type walletType = 'sol'

// export enum WalletType {
//     SOL = 'sol',
// }

@Entity({ name: 'wallet' })
export class Wallet {
    @PrimaryGeneratedColumn('uuid', { name: 'id' })
    public id: string

    // @Column({ nullable: false })
    @CreateDateColumn({ name: 'created_at' })
    public createdAt: Date

    // @Column({ nullable: false })
    @UpdateDateColumn({ name: 'updated_at' })
    public updatedAt: Date

    @DeleteDateColumn({ name: 'deleted_at' })
    public deletedAt?: Date | null

    @Column({ name: 'currency', nullable: false })
    public currency: CURRENCY_TYPE

    @Column({ nullable: false, name: 'address' })
    public address: string

    @Column({ nullable: false, name: 'description' })
    public description: string

    @Column({ nullable: false, name: 'user_id' })
    public userId: string

    @ManyToOne(() => User, (user) => user.wallets)
    public user: User
}
