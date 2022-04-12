import { Module } from '@nestjs/common'
import { DonateService } from './service/donate.service'
import { DonationController } from './donation.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DonationEntity } from './entity/donation.entity'
import { RecipientService } from './service/recipient.service'
import { RecipientEntity } from './entity/recipient.entity'

@Module({
    imports: [TypeOrmModule.forFeature([DonationEntity])],
    controllers: [DonationController],
    providers: [DonateService, RecipientService],
})
export class DonationModule {}
