import { BadRequestException, Injectable } from '@nestjs/common'
import { CURRENCY_TYPE } from 'src/common/currency'
import { DonationService } from 'src/donation/service/donation.service'
import { Payment } from '../domain/payment.entity'
import { PaymentRepository } from '../repository/payment.repository'
import { SolanaConnection } from './sol.connection'
import { SolTransferTransaction } from './sol.transfer.transaction'

@Injectable()
export class SolanaPaymentService {
    constructor(
        private readonly paymentRepository: PaymentRepository,
        private readonly donationService: DonationService,
        private readonly solanaConnection: SolanaConnection,
    ) {}

    async getPaymentByDonationId(donationId: string) {
        return this.paymentRepository.findOne({
            where: {
                donationId,
            },
        })
    }

    async paymentBySolana(donationId: string, rawTransaction: string) {
        const donation = await this.donationService.getDonationById(donationId)

        if (!donation) {
            throw new BadRequestException('Donation not found')
        }

        if (this.getPaymentByDonationId(donationId) !== undefined) {
            throw new BadRequestException('Payment already exists')
        }

        const solTransfer =
            SolTransferTransaction.fromRawTransaction(rawTransaction)

        const payment = await this.paymentRepository.save(
            solTransfer.toPayment(donationId, donation.toUserId),
        )

        const tx = await this.solanaConnection.sendRawTransaction(
            solTransfer.transaction.serialize(),
        )

        this.solanaConnection.confirmTransaction(tx).then(() => {
            //
        })
    }
}
