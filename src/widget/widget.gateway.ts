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

        // 유저 검증 과정은 변경이 필요함 > 소켓이 연결되기전에 확인
        try {
            const user = await this.userService.getUserByUsername(username)
            client.join(this.getCreatorRoomname(user.id))

            this.logger.log(`client id:${client.id} connected`)
        } catch (e) {
            console.log('user not found')
            client.disconnect()
        }
    }

    handleDisconnect(client: Socket) {
        this.logger.log(`client id:${client.id} closed`)
    }

    @OnEvent('widget.donate')
    donateEvent(payload: any) {
        const { toUserId, ...info } = payload

        this.getCreatorRoom(toUserId).emit('donation', info)
    }

    @OnEvent('widget.pause')
    widgetPause(userId: string) {
        this.getCreatorRoom(userId).emit('pause')
    }

    @OnEvent('widget.play')
    widgetPlay(userId: string) {
        this.getCreatorRoom(userId).emit('play')
    }

    @OnEvent('widget.skip')
    widgetSkip(userId: string) {
        this.getCreatorRoom(userId).emit('skip')
    }
}
