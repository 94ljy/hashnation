import { Injectable } from '@nestjs/common'
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter'
import { AppLogger } from '../../logger/logger.service'
import { DonationRepository } from '../repository/donation.repository'
import { DonationStatus } from '../domain/donation.entity'
import { DonationCreatedEvent } from '../event/donation.created.event'
import { SolanaConnection } from '../service/sol.connection'

@Injectable()
export class DonationCreatedListener {
    constructor(
        private readonly solanaConn: SolanaConnection,
        private readonly logger: AppLogger,
        private readonly donationRepository: DonationRepository,
        private readonly eventEmitter: EventEmitter2,
    ) {}

    @OnEvent(DonationCreatedEvent.name)
    async handle(event: DonationCreatedEvent) {
        const donation = event.donation
        const tx = donation.txHash

        // const result = await this.solanaConn.confirmTransaction(tx)

        // if (result.value.err) {
        //     this.logger.error(`tx:${tx} Transaction failed ${result.value.err}`)

        //     await this.donationRepository.updateDonationStatus(
        //         donation.id,
        //         DonationStatus.REJECTED,
        //     )
        // } else {
        //     await this.donationRepository.updateDonationStatus(
        //         donation.id,
        //         DonationStatus.APPROVED,
        //     )
        // }
    }
}
