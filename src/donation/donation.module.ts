import { Module } from '@nestjs/common'
import { DonationService } from './service/donation.service'
import { DonationController } from './controller/donation.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Donation } from '../repository/entities/donation.entity'
import { UserModule } from '../user/user.module'
import { WalletModule } from '../wallet/wallet.module'
import { DonorService } from './service/donor.service'
import { DonorController } from './controller/donor.controller'
import { DonationRepository } from '../repository/donation.repository'

@Module({
    imports: [
        UserModule,
        WalletModule,
        TypeOrmModule.forFeature([DonationRepository]),
    ],
    controllers: [DonationController, DonorController],
    providers: [DonationService, DonorService],
})
export class DonationModule {}
