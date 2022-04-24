import {
    Column,
    CreateDateColumn,
    Entity,
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

@Entity({
    name: 'donation',
})
export class DonationEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @CreateDateColumn({ nullable: false })
    createdAt: Date

    @Column({
        type: 'varchar',
        length: 255,
        nullable: false,
        unique: true,
    })
    txSignature: string

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

    @ManyToOne((type) => UserEntity)
    toUser: UserEntity
}
