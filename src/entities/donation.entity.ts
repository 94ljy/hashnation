import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm'
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

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date

    @Column({
        type: 'varchar',
        length: 255,
        nullable: false,
        unique: true,
        name: 'tx_signature',
    })
    txSignature: string

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
        type: 'integer',
        nullable: false,
        name: 'lamports',
    })
    lamports: number

    @Column({
        type: 'integer',
        nullable: false,
        default: DonationStatus.PENDING,
        name: 'status',
    })
    status: DonationStatus

    // @Column({
    //     type: 'boolean',
    //     nullable: false,
    //     default: false,
    // })
    // isBrodcasted: boolean

    @Column({ name: 'to_user_id' })
    toUserId: string

    @ManyToOne((type) => User)
    toUser: User
}
