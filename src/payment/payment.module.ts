import { Module } from '@nestjs/common'
import { PaymentController } from './payment.controller'
import { SolanaPaymentService } from './service/solana.payment.service'

@Module({
    controllers: [PaymentController],
    providers: [SolanaPaymentService],
})
export class PaymentModule {}
