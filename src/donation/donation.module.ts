import { Module } from '@nestjs/common'
import { DonationService } from './service/donation.service'
import { DonationController } from './controller/donation.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserModule } from '../user/user.module'
import { WalletModule } from '../wallet/wallet.module'
import { DonorService } from './service/donor.service'
import { DonorController } from './controller/donor.controller'
import { DonationRepository } from './repository/donation.repository'
import { SolDonateService } from './service/sol.donate.service'
import { SolanaConnection } from './service/sol.connection'

@Module({
    imports: [
        UserModule,
        WalletModule,
        TypeOrmModule.forFeature([DonationRepository]),
    ],
    controllers: [DonationController, DonorController],
    providers: [
        DonationService,
        DonorService,
        SolDonateService,
        SolanaConnection,
    ],
})
export class DonationModule {}
