import { BadRequestException, Injectable } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { InjectRepository } from '@nestjs/typeorm'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import { Repository } from 'typeorm'
import {
    Donation,
    DonationStatus,
} from '../../repository/entities/donation.entity'
import { WIDGET_DONATE_EVENT } from '../../event/event'
import { DonationRepository } from '../../repository/donation.repository'

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
        return this.donationRepository.findAndCount(userId, page, limit)
    }

    async replayDonation(userId: string, donationId: string) {
        const donation = await this.donationRepository.findOneByDonationId(
            userId,
            donationId,
        )

        if (!donation) throw new BadRequestException('Donation not found')

        if (donation.status !== DonationStatus.APPROVED) {
            throw new BadRequestException('Donation is not approved')
        }

        this.eventEmitter.emit(WIDGET_DONATE_EVENT, donation)
    }
}
