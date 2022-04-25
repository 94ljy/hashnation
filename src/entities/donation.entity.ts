import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm'
import { UserEntity } from './user.entity'

export enum DonationStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
    BRODCASTED = 'BRODCASTED',
}

// @Index('donation_user_id_index', ['userId'], { unique: true })
@Entity({
    name: 'donation',
})
@Index('donation_created_at_index', ['createdAt'])
@Index('donation_user_id_index', ['user_id'])
@Index('donation_user_id_and_created_at_index', ['user_id', 'created_at'])
@Index('donation_user_id_and_status_index', ['user_id', 'status'])
@Index('donation_tx_signature_index', ['tx_signature'], { unique: true })
@Index('donation_from_address_index', ['from_address'])
export class DonationEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @CreateDateColumn()
    createdAt: Date

    @Column({
        type: 'varchar',
        length: 255,
        nullable: false,
        unique: true,
    })
    txSignature: string

    @Index()
    @Column({
        type: 'varchar',
        nullable: false,
    })
    fromAddress: string

    @Column({
        type: 'varchar',
        nullable: false,
    })
    toAddress: string

    @Column({
        length: 255,
        type: 'varchar',
        nullable: false,
    })
    message: string

    @Column({
        type: 'integer',
        nullable: false,
    })
    lamports: number

    @Column({
        type: 'integer',
        nullable: false,
        default: DonationStatus.PENDING,
    })
    status: DonationStatus

    // @Column({
    //     type: 'boolean',
    //     nullable: false,
    //     default: false,
    // })
    // isBrodcasted: boolean

    @Column()
    toUserId: string

    @Index()
    @ManyToOne((type) => UserEntity)
    toUser: UserEntity
}
