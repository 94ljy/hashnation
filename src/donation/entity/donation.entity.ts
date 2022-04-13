import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { UserEntity } from '../../user/entity/user.entity'

export enum DonationStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
}

@Entity({
    name: 'donation',
})
export class DonationEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({
        type: 'varchar',
        length: 255,
        nullable: false,
        unique: true,
    })
    txSignature: string

    @Column({
        type: 'datetime',
        nullable: false,
    })
    createdAt: Date

    @Column({
        type: 'varchar',
        nullable: false,
    })
    from: string

    @Column({
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

    @Column({
        type: 'boolean',
        nullable: false,
        default: false,
    })
    isBrodcasted: boolean

    @Column()
    toId: string

    @ManyToOne((type) => UserEntity, (user) => user.donations)
    to: UserEntity
}
