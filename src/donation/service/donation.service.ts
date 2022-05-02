import { BadRequestException, Injectable } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { InjectRepository } from '@nestjs/typeorm'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import { Repository } from 'typeorm'
import { Donation, DonationStatus } from '../../entities/donation.entity'

@Injectable()
export class DonationService {
    constructor(
        private readonly eventEmitter: EventEmitter2,
        @InjectRepository(Donation)
        private readonly donationRepository: Repository<Donation>,
    ) {}

    async getDonations(
        userId: string,
        page: number,
        limit: number,
    ): Promise<[Donation[], number]> {
        return this.donationRepository.findAndCount({
            where: { toUserId: userId },
            skip: (page - 1) * limit,
            take: limit,
            order: {
                createdAt: 'DESC',
            },
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

        if (donation.status !== DonationStatus.APPROVED) {
            throw new BadRequestException('Donation is not approved')
        }

        this.eventEmitter.emit('widget.donate', donation)
    }
}
