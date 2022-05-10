import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm'
import { CURRENCY_TYPE } from '../../common/currency'

@Entity()
export class Payment {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @Column({ nullable: false, name: 'currency' })
    currency: CURRENCY_TYPE

    @Column({ nullable: false, name: 'tx_hash' })
    txHash: string

    @Column({ nullable: false, name: 'amount' })
    amount: number

    @Column({
        type: 'varchar',
        nullable: false,
        name: 'from_address',
    })
    fromAddress: string

    @Column({
        type: 'varchar',
        nullable: false,
        name: 'to_address',
    })
    toAddress: string
}
