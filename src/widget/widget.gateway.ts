import { OnEvent } from '@nestjs/event-emitter'
import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { UserService } from '../user/user.service'
import {
    WIDGET_PAUSE_EVENT,
    WIDGET_PLAY_EVENT,
    WIDGET_SKIP_EVENT,
} from './event'
import { AppLogger } from '../logger/logger.service'
import { DonationApprovedEvent } from '../donation/event/donation.approve.event'
import { DonationReplayEvent } from '../donation/event/donation.replay.event'

@WebSocketGateway()
export class WidgetGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server
    constructor(
        private readonly userService: UserService,
        private readonly logger: AppLogger,
    ) {}

    private getCreatorRoomname(userId: string) {
        return `creator_${userId}`
    }

    private getCreatorRoom(userId: string) {
        return this.server.to(this.getCreatorRoomname(userId))
    }

    async handleConnection(client: Socket, ...args: any[]) {
        const username = client.handshake.auth.username

        const user = await this.userService.getUserByUsername(username)

        // 유저 검증 과정은 변경이 필요함 소켓이 연결되기전에 확인
        if (!user) {
            this.logger.log(`client id:${client.id} failed to connect`)
            client.disconnect()
        } else {
            client.join(this.getCreatorRoomname(user.id))

            this.logger.log(`client id:${client.id} connected`)
        }
    }

    handleDisconnect(client: Socket) {
        this.logger.log(`client id:${client.id} closed`)
    }

    // TODO 중복코드 리팩토링이 필요함...
    @OnEvent(DonationReplayEvent.name)
    replay(donationReplayEvent: DonationReplayEvent) {
        const { toUserId, toUser, ...info } = donationReplayEvent.donation

        this.getCreatorRoom(toUserId).emit('donation', info)
    }

    @OnEvent(DonationApprovedEvent.name)
    donateEvent(donationApprovedEvent: DonationApprovedEvent) {
        const { toUserId, toUser, ...info } = donationApprovedEvent.donation

        this.getCreatorRoom(toUserId).emit('donation', info)
    }

    @OnEvent(WIDGET_PAUSE_EVENT)
    widgetPause(userId: string) {
        this.getCreatorRoom(userId).emit('pause')
    }

    @OnEvent(WIDGET_PLAY_EVENT)
    widgetPlay(userId: string) {
        this.getCreatorRoom(userId).emit('play')
    }

    @OnEvent(WIDGET_SKIP_EVENT)
    widgetSkip(userId: string) {
        this.getCreatorRoom(userId).emit('skip')
    }
}
