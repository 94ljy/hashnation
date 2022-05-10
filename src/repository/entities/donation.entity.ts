import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm'
import { CURRENCY_TYPE } from '../../common/currency'
import { User } from './user.entity'

export enum DonationStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
    BRODCASTED = 'BRODCASTED',
}

// @Index('donation_user_id_index', ['userId'], { unique: true })

// @Index('donation_created_at_index', ['createdAt'])
// @Index('donation_user_id_index', ['toUserId'])
@Index('donation_user_id_and_created_at_index', ['toUserId', 'createdAt'])
@Index('donation_user_id_and_status_index', ['toUserId', 'status'])
// @Index('donation_tx_signature_index', ['txSignature'], { unique: true })
@Index('donation_from_address_index', ['fromAddress'])
@Entity({
    name: 'donation',
})
export class Donation {
    @PrimaryGeneratedColumn('uuid', { name: 'id' })
    id: string

    @CreateDateColumn({ nullable: false, name: 'created_at' })
    createdAt: Date

    @Column({ nullable: true, name: 'done_at' })
    doneAt?: Date

    @Column({ nullable: false, name: 'currency' })
    currency: CURRENCY_TYPE

    @Column({ nullable: false, name: 'tx_hash' })
    txHash: string

    @Column({ nullable: false, name: 'amount' })
    amount: number

    @Column({
        type: 'varchar',
        nullable: false,
        name: 'from_address',
    })
    fromAddress: string

    @Column({
        type: 'varchar',
        nullable: false,
        name: 'to_address',
    })
    toAddress: string

    @Column({
        length: 255,
        type: 'varchar',
        nullable: false,
        name: 'message',
    })
    message: string

    @Column({
        type: 'varchar',
        nullable: false,
        default: DonationStatus.PENDING,
        name: 'status',
    })
    status: DonationStatus

    @Column({ name: 'to_user_id' })
    toUserId: string

    @ManyToOne((type) => User)
    @JoinColumn({ name: 'to_user_id' })
    toUser: User
}
