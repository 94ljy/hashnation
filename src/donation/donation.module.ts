import { Module } from '@nestjs/common'
import { DonateService } from './service/donate.service'
import { DonationController } from './donation.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DonationEntity } from './entity/donation.entity'
import { UserModule } from '../user/user.module'
import { DonationService } from './service/donation.service'

@Module({
    imports: [TypeOrmModule.forFeature([DonationEntity]), UserModule],
    controllers: [DonationController],
    providers: [DonateService, DonationService],
})
export class DonationModule {}
