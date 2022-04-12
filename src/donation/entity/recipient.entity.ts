import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { DonationEntity } from './donation.entity'

@Entity()
export class RecipientEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({
        type: 'datetime',
        nullable: false,
    })
    createdAt: Date

    @Column({
        type: 'datetime',
        nullable: true,
    })
    updatedAt: Date

    @Column({
        type: 'varchar',
        length: 255,
        nullable: false,
        unique: true,
    })
    address: string

    @Column({
        type: 'varchar',
        length: 255,
        nullable: false,
        unique: true,
    })
    name: string

    @OneToMany((type) => DonationEntity, (donation) => donation.recipient)
    donations: DonationEntity[]
}
