import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class UserEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

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

    @Column({
        type: 'varchar',
        length: 44,
        nullable: false,
        unique: true,
    })
    publicKey: string
}
