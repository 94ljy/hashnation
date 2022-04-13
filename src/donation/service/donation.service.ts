import { Injectable, NotFoundException } from '@nestjs/common'
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
        const user = await this.userService.getUser('id', userId)

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

        if (!donation) throw new NotFoundException()

        return donation
    }

    // async getUserInfo(publicKey: string) {
    //     const user = await this.userService.getUser('publicKey', publicKey)

    //     return {
    //         publicKey: user.publicKey,
    //         username: user.username,
    //     }
    // }

    async donationBrodcastSuccess(userId: string, donationId: string) {
        const result = await this.donationRepository
            .createQueryBuilder()
            .update()
            .set({
                isBrodcasted: true,
            })
            .where('id = :id AND toId = :toId', {
                id: donationId,
                toId: userId,
            })
            .execute()

        if (result.affected === 0) {
            throw new NotFoundException()
        }
    }
}
