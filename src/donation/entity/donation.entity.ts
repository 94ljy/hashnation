import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
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
    to: string

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
