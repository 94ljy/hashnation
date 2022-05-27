import { CURRENCY_TYPE } from 'src/common/currency'
import { Donation } from 'src/donation/domain/donation.entity'
import { User } from 'src/user/domain/user.entity'
import {
    Column,
    CreateDateColumn,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm'

enum PAYMENT_STATUS {
    PENDING = 'PENDING',
    APPORVED = 'APPORVED',
    REJECTED = 'REJECTED',
}

export class Payment {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date

    @Column({ name: 'status' })
    status: PAYMENT_STATUS

    @Column({ name: 'currency' })
    currecy: CURRENCY_TYPE

    @Column({ name: 'tx_hash' })
    txHash: string

    @Column({ name: 'amount' })
    amount: number

    @Column({ name: 'donation_id' })
    donationId: string

    @OneToOne(() => Donation)
    @JoinColumn({ name: 'donation_id' })
    donation: Donation

    @Column({ name: 'user_id' })
    userId: string

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User

    private constructor() {
        //
    }

    public static createPenndingPayment(
        currecy: CURRENCY_TYPE,
        txHash: string,
        amount: number,
        donationId: string,
        userId: string,
    ): Payment {
        const payment = new Payment()
        payment.currecy = currecy
        payment.txHash = txHash
        payment.amount = amount
        payment.donationId = donationId
        payment.userId = userId
        payment.status = PAYMENT_STATUS.PENDING
        return payment
    }

    approve() {
        this.status = PAYMENT_STATUS.APPORVED
    }

    reject() {
        this.status = PAYMENT_STATUS.REJECTED
    }

    isApproved(): boolean {
        return this.status === PAYMENT_STATUS.APPORVED
    }
}
