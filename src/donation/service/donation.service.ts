import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { DonationEntity } from '../../entities/donation.entity'

@Injectable()
export class DonationService {
    constructor(
        @InjectRepository(DonationEntity)
        private readonly donationRepository: Repository<DonationEntity>,
    ) {}
}
