import { CreatorEntity } from '../../creator/entity/creator.entity'
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

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

    @Column({
        type: 'varchar',
        nullable: false,
    })
    fromId: string

    @Column()
    toId: string

    @ManyToOne((type) => CreatorEntity)
    to: CreatorEntity
}
