import { Module } from '@nestjs/common'
import { DonationService } from './service/donation.service'
import { DonationController } from './controller/donation.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Donation } from '../entities/donation.entity'
import { UserModule } from '../user/user.module'
import { WalletModule } from '../wallet/wallet.module'
import { DonorService } from './service/donor.service'
import { DonorController } from './controller/donor.controller'

@Module({
    imports: [UserModule, WalletModule, TypeOrmModule.forFeature([Donation])],
    controllers: [DonationController, DonorController],
    providers: [DonationService, DonorService],
})
export class DonationModule {}
