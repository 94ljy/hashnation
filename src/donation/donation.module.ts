import { Module } from '@nestjs/common'
import { DonorService } from './service/donor.service'
import { DonationController } from './donation.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DonationEntity } from './entity/donation.entity'
import { DonationService } from './service/donation.service'
import { CreatorModule } from '../creator/creator.module'

@Module({
    imports: [CreatorModule, TypeOrmModule.forFeature([DonationEntity])],
    controllers: [DonationController],
    providers: [DonorService, DonationService],
})
export class DonationModule {}
