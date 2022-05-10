import { Injectable } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import {
    WIDGET_DONATE_EVENT,
    WIDGET_PAUSE_EVENT,
    WIDGET_PLAY_EVENT,
    WIDGET_SKIP_EVENT,
} from '../event/event'
import { AppLogger } from '../logger/logger.service'
import { Donation } from '../repository/entities/donation.entity'

@Injectable()
export class WidgetService {
    constructor(
        private readonly eventEmitter: EventEmitter2,
        private readonly logger: AppLogger,
    ) {}

    async widgetPause(userId: string) {
        this.logger.log(`User ${userId} paused the widget`)
        this.eventEmitter.emit(WIDGET_PAUSE_EVENT, userId)
    }

    async widgetPlay(userId: string) {
        this.logger.log(`User ${userId} played the widget`)
        this.eventEmitter.emit(WIDGET_PLAY_EVENT, userId)
    }

    async widgetSkip(userId: string) {
        this.logger.log(`User ${userId} skipped the widget`)
        this.eventEmitter.emit(WIDGET_SKIP_EVENT, userId)
    }

    widgetDonationTest(userId: string) {
        const donation = new Donation()
        donation.toUserId = userId
        donation.fromAddress = '0x0000000000000000000000000000000000000000'
        donation.message = 'test donation'
        donation.amount = LAMPORTS_PER_SOL

        this.eventEmitter.emit(WIDGET_DONATE_EVENT, donation)
    }
}
