import { Module } from '@nestjs/common'
import { DonorService } from './service/donate.service'
import { DonationController } from './donation.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DonationEntity } from './entity/donation.entity'
import { UserModule } from '../user/user.module'
import { DonationService } from './service/donation.service'

@Module({
    imports: [TypeOrmModule.forFeature([DonationEntity]), UserModule],
    controllers: [DonationController],
    providers: [DonorService, DonationService],
})
export class DonationModule {}
