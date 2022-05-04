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
import { User } from './user.entity'

// export type walletType = 'sol'

@Index()
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

    // @Column()
    // public type: walletType

    @Index()
    @Column({ nullable: false, name: 'address' })
    public address: string

    @Column({ nullable: false, name: 'user_id' })
    public userId: string

    @ManyToOne(() => User, (user) => user.wallets)
    public user: User
}