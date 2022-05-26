import { BadRequestException } from '@nestjs/common'
import { PublicKey } from '@solana/web3.js'
import base58 from 'bs58'
import nacl from 'tweetnacl'
import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    Index,
    ManyToOne,
    PrimaryColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm'
import { CURRENCY_TYPE } from '../../common/currency'
import { User } from '../../user/domain/user.entity'

export const CREATE_USER_WALLSET_MESSAGE = new TextEncoder().encode(
    'Approve Add Wallet',
)

@Entity({ name: 'wallet' })
export class Wallet {
    @PrimaryGeneratedColumn('uuid', { name: 'id' })
    public id: string

    // @Column({ nullable: false })
    @CreateDateColumn({ name: 'created_at' })
    public createdAt: Date

    // @Column({ nullable: false })
    @UpdateDateColumn({ name: 'updated_at' })
    public updatedAt: Date

    @DeleteDateColumn({ name: 'deleted_at' })
    public deletedAt?: Date | null

    @Column({ name: 'currency', nullable: false })
    public currency: CURRENCY_TYPE

    @Column({ nullable: false, name: 'address' })
    public address: string

    @Column({ nullable: false, name: 'description' })
    public description: string

    @Column({ nullable: false, name: 'user_id' })
    public userId: string

    @ManyToOne(() => User, (user) => user.wallets)
    public user: User

    public static createWallet(
        currency: CURRENCY_TYPE,
        address: string,
        userId: string,
    ) {
        const newWallet = new Wallet()
        newWallet.currency = currency
        newWallet.address = address
        newWallet.description = ''
        newWallet.userId = userId

        return newWallet
    }

    validate(signature: string) {
        if (this.currency === CURRENCY_TYPE.SOL) {
            try {
                const pub = new PublicKey(this.address)

                const isValidSignature = nacl.sign.detached.verify(
                    CREATE_USER_WALLSET_MESSAGE,
                    base58.decode(signature),
                    pub.toBuffer(),
                )
                if (!isValidSignature) throw new Error()
            } catch (e) {
                throw new Error('Invalid signature')
            }

            // try {
            //     const isValidSignature = nacl.sign.detached.verify(
            //         CREATE_USER_WALLSET_MESSAGE,
            //         base58.decode(signature),
            //         base58.decode(this.address),
            //     )
            //     if (!isValidSignature) throw new Error()
            // } catch (e) {
            //     throw new BadRequestException('Invalid signature')
            // }
        } else {
            throw new Error('Invalid currency')
        }
    }

    delete() {
        this.deletedAt = new Date()
    }
}
