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

    async getDonations(userId: string, page: number, limit: number) {
        return this.donationRepository.find({
            where: { toUserId: userId },
            skip: (page - 1) * limit,
            take: limit,
            order: {
                createdAt: 'DESC',
            },
        })
    }
}
