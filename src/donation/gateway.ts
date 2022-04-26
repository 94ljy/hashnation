import { OnEvent } from '@nestjs/event-emitter'
import {
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets'
import { Observable } from 'rxjs'
import { Server, Socket } from 'socket.io'

@WebSocketGateway({
    // transports: ['websocket'],
})
export class TestGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server

    handleConnection(client: Socket, ...args: any[]) {
        // throw new Error('Method not implemented.')
        console.log('connected')

        // console.log(client.id)

        // for (const [k, v] of this.server.of('/').sockets) {
        //     console.log(v.id)
        // }

        // const soc = this.server.sockets.sockets.get(client.id)
        // console.log(soc.id)

        // console.log(client.data)
        // console.log((client.data.test = 'test'))
        // this.server.emi

        // console.log(this.server.of('/').sockets.get('client'))

        client.join('test_room')

        // setInterval(() => {
        //     client.send('hello')
        // }, 1000)
    }

    handleDisconnect(client: Socket) {
        // throw new Error('Method not implemented.')
        console.log('closed')
        // console.log(client.data)
    }

    @OnEvent('event.test')
    testEvent(payload: any) {
        console.log(payload + '11')
        this.server.to('test_room').emit('pong', 'hahaha')
    }

    // @SubscribeMessage('message')
    // test(@MessageBody() data: any) {
    //     console.log(data)
    // }

    @SubscribeMessage('ping')
    ping(@MessageBody() data: any) {
        console.log(data)

        this.server.emit('pong', 'pong_pong')

        return 'pong'
    }
}
