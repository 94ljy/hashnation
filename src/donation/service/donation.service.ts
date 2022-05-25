import { BadRequestException, Injectable } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { Donation } from '../domain/donation.entity'
import { DonationRepository } from '../repository/donation.repository'
import { DonationReplayEvent } from '../event/donation.replay.event'

@Injectable()
export class DonationService {
    constructor(
        private readonly eventEmitter: EventEmitter2,
        private readonly donationRepository: DonationRepository,
    ) {}

    async getDonations(
        userId: string,
        page: number,
        limit: number,
    ): Promise<[Donation[], number]> {
        return this.donationRepository.findAndCount({
            where: {
                toUserId: userId,
            },
            skip: (page - 1) * limit,
            take: limit,
        })
    }

    async replayDonation(userId: string, donationId: string) {
        const donation = await this.donationRepository.findOne({
            where: {
                id: donationId,
                toUserId: userId,
            },
        })

        if (!donation) throw new BadRequestException('Donation not found')

        if (!donation.isApprove()) {
            throw new BadRequestException('Donation is not approved')
        }

        this.eventEmitter.emit(
            DonationReplayEvent.name,
            DonationReplayEvent.from(donation),
        )
    }
}
