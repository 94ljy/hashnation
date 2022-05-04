import { Inject, LoggerService } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { UserService } from '../user/user.service'
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston'
import { Donation } from '../repository/entities/donation.entity'
import {
    WIDGET_DONATE_EVENT,
    WIDGET_PAUSE_EVENT,
    WIDGET_PLAY_EVENT,
    WIDGET_SKIP_EVENT,
} from '../event/event'

@WebSocketGateway()
export class WidgetGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server
    constructor(
        private readonly userService: UserService,
        @Inject(WINSTON_MODULE_NEST_PROVIDER)
        private readonly logger: LoggerService,
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

        // 유저 검증 과정은 변경이 필요함 소켓이 연결되기전에 확인
        // try {
        //     const user = await this.userService.getUserByUsername(username)
        //     client.join(this.getCreatorRoomname(user.id))

        //     this.logger.log(`client id:${client.id} connected`)
        // } catch (e) {
        //     this.logger.log(`client id:${client.id} failed to connect`)
        //     client.disconnect()
        // }
    }

    handleDisconnect(client: Socket) {
        this.logger.log(`client id:${client.id} closed`)
    }

    @OnEvent(WIDGET_DONATE_EVENT)
    donateEvent(donation: Donation) {
        // const { toUserId, ...info } = payload

        const { toUserId, toUser, ...info } = donation

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
