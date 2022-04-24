import { Module } from '@nestjs/common'
import { DonationService } from './service/donation.service'
import { DonationController } from './donation.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DonationEntity } from '../entities/donation.entity'
import { UserModule } from '../user/user.module'
import { WalletModule } from '../wallet/wallet.module'
import { DonorService } from './service/donor.service'

@Module({
    imports: [
        UserModule,
        WalletModule,
        TypeOrmModule.forFeature([DonationEntity]),
    ],
    controllers: [DonationController],
    providers: [DonationService, DonorService],
})
export class DonationModule {}
