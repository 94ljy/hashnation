import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UserService } from '../../user/user.service'
import { Repository } from 'typeorm'
import { DonationEntity } from '../entity/donation.entity'

@Injectable()
export class DonationService {
    constructor(
        @InjectRepository(DonationEntity)
        private readonly donationRepository: Repository<DonationEntity>,
        private readonly userService: UserService,
    ) {}

    async getDonation(userId: string) {
        const user = await this.userService.getUserById(userId)

        const donation = await this.donationRepository.findOne({
            where: {
                isBrodcasted: false,
                to: {
                    id: user.id,
                },
            },
            order: {
                createdAt: 'ASC',
            },
        })

        return donation
    }
}
