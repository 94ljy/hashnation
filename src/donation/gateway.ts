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

@WebSocketGateway({})
export class TestGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server

    handleConnection(client: Socket, ...args: any[]) {
        // throw new Error('Method not implemented.')
        console.log('qwer')

        console.log(client.id)

        for (const [k, v] of this.server.of('/').sockets) {
            console.log(v.id)
        }

        const soc = this.server.sockets.sockets.get(client.id)
        console.log(soc.id)

        console.log(client.data)
        console.log((client.data.test = 'test'))

        // console.log(this.server.of('/').sockets.get('client'))
    }

    handleDisconnect(client: Socket) {
        // throw new Error('Method not implemented.')
        console.log('qwer2')
        console.log(client.data)
    }

    test() {
        //
    }
}
