import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm'
import { CreatorEntity } from './creator.entity'

export type walletType = 'sol'

@Entity({ name: 'creator_wallet' })
export class CreatorWalletEntity {
    @PrimaryColumn()
    id: string

    @Column()
    type: walletType

    @Column()
    address: string

    @Column()
    createdAt: Date

    @Column({ nullable: true })
    deletedAt: Date

    @Column()
    creatorId: string

    @ManyToOne(() => CreatorEntity, (creator) => creator.wallets)
    creator: CreatorEntity
}
