import { EntityRepository, Repository } from 'typeorm'
import { Donation } from '../domain/donation.entity'

@EntityRepository(Donation)
export class DonationRepository extends Repository<Donation> {}
