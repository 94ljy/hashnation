import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class DonationEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        type: 'varchar',
        length: 255,
        nullable: false,
        unique: true,
    })
    signature: string

    @Column({
        type: 'datetime',
        nullable: false,
    })
    createdAt: Date

    @Column({
        type: 'integer',
        nullable: false,
    })
    lamports: number

    @Column({
        type: 'boolean',
        nullable: false,
        default: false,
    })
    isConfirmed: boolean

    @Column({
        type: 'boolean',
        nullable: false,
        default: false,
    })
    isBrodcasted: boolean
}
