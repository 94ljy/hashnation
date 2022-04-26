import { OnEvent } from '@nestjs/event-emitter'
import {
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
    WsException,
} from '@nestjs/websockets'
import { Observable } from 'rxjs'
import { Server, Socket } from 'socket.io'
import { UserService } from '../../user/user.service'

@WebSocketGateway()
export class WidgetGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server
    constructor(private readonly userService: UserService) {}

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

            console.log(`client id:${client.id} connected`)
        } catch (e) {
            console.log('user not found')
            client.disconnect()
        }
    }

    handleDisconnect(client: Socket) {
        console.log(`client id:${client.id} closed`)
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
