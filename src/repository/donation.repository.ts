import { AbstractRepository, EntityRepository } from 'typeorm'
import { Donation, DonationStatus } from './entities/donation.entity'

@EntityRepository(Donation)
export class DonationRepository extends AbstractRepository<Donation> {
    async createDonation(doantion: Donation): Promise<Donation> {
        return this.repository.save(doantion)
    }

    async findAndCount(
        userId: string,
        page: number,
        limit: number,
    ): Promise<[Donation[], number]> {
        return this.repository.findAndCount({
            where: { toUserId: userId },
            skip: (page - 1) * limit,
            take: limit,
            order: {
                createdAt: 'DESC',
            },
        })
    }

    async findOneByDonationId(
        userId: string,
        donationId: string,
    ): Promise<Donation | null> {
        return (
            (await this.repository.findOne({
                id: donationId,
                toUserId: userId,
            })) ?? null
        )
    }

    async updateDonationStatus(donationId: string, status: DonationStatus) {
        return this.repository.update(donationId, {
            status: status,
        })
    }
}
