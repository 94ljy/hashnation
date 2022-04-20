import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { DonationEntity } from '../entity/donation.entity'

@Injectable()
export class DonationService {
    constructor(
        @InjectRepository(DonationEntity)
        private readonly donationRepository: Repository<DonationEntity>,
    ) {}

    // async getDonation(userId: string) {
    //     const user = await this.userService.getUser('id', userId)

    //     const donation = await this.donationRepository.findOne({
    //         where: {
    //             isBrodcasted: false,
    //             to: {
    //                 id: user.id,
    //             },
    //         },
    //         order: {
    //             createdAt: 'ASC',
    //         },
    //     })

    //     if (!donation) throw new NotFoundException()

    //     return donation
    // }

    // async getD(userId: string) {
    //     const user = await this.userService.getUser('id', userId)

    //     return {
    //         username: user.username,
    //         donationUrl: `http://localhost:8080/donate/${user.publicKey}`,
    //     }
    // }

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
