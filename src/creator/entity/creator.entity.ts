import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm'
import { CreatorWalletEntity } from './wallet.entity'

export type creatorUniqueKey = keyof Pick<CreatorEntity, 'id' | 'username'>

@Entity({ name: 'creator' })
export class CreatorEntity {
    @PrimaryColumn()
    id: string

    @Column({ unique: true })
    username: string

    @Column()
    createdAt: Date

    @Column({ nullable: true })
    updatedAt: Date

    @OneToMany(() => CreatorWalletEntity, (wallet) => wallet.creator)
    wallets: CreatorWalletEntity[]
}
