import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { DonationEntity } from '../../donation/entity/donation.entity'

@Entity({
    name: 'user',
})
export class UserEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({
        type: 'varchar',
        length: 44,
        nullable: false,
        unique: true,
    })
    publicKey: string

    @Column({
        type: 'varchar',
        length: 255,
        nullable: false,
        unique: true,
    })
    username: string

    @Column({
        type: 'datetime',
        nullable: false,
    })
    createdAt: Date

    @Column({
        type: 'datetime',
        nullable: true,
    })
    lastLoginAt: Date

    @OneToMany((type) => DonationEntity, (donation) => donation.to)
    donations: DonationEntity[]
}
