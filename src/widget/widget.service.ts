import { Inject, Injectable, LoggerService } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston'
import { Donation } from '../entities/donation.entity'

@Injectable()
export class WidgetService {
    constructor(
        private readonly eventEmitter: EventEmitter2,
        @Inject(WINSTON_MODULE_NEST_PROVIDER)
        private readonly logger: LoggerService,
    ) {}

    async widgetPause(userId: string) {
        this.logger.log(`User ${userId} paused the widget`)
        this.eventEmitter.emit('widget.pause', userId)
    }

    async widgetPlay(userId: string) {
        this.logger.log(`User ${userId} played the widget`)
        this.eventEmitter.emit('widget.play', userId)
    }

    async widgetSkip(userId: string) {
        this.logger.log(`User ${userId} skipped the widget`)
        this.eventEmitter.emit('widget.skip', userId)
    }

    widgetDonationTest(userId: string) {
        const donation = new Donation()
        donation.toUserId = userId
        donation.fromAddress = '0x0000000000000000000000000000000000000000'
        donation.message = 'test donation'
        donation.lamports = LAMPORTS_PER_SOL

        this.eventEmitter.emit('widget.donate', donation)
    }
}
