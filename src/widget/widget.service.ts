import { Injectable } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'

@Injectable()
export class WidgetService {
    constructor(private readonly eventEmitter: EventEmitter2) {}

    async widgetPause(userId: string) {
        this.eventEmitter.emit('widget.pause', userId)
    }

    async widgetPlay(userId: string) {
        this.eventEmitter.emit('widget.play', userId)
    }

    async widgetSkip(userId: string) {
        this.eventEmitter.emit('widget.skip', userId)
    }
}
