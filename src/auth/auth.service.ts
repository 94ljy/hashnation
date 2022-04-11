import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PublicKey } from '@solana/web3.js'
import base58 from 'bs58'
import moment from 'moment'
import nacl from 'tweetnacl'
import { UserService } from '../user/user.service'
import { LoginMessage } from './dto/login.dto'

@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService) {}

    async signup(username: string, publicKey: string) {
        await this.userService.createUser(username, publicKey)
    }

    async validateUser(message: string, signature: string) {
        const paresdMessage = JSON.parse(message) as LoginMessage

        const time = moment(paresdMessage.timestamp)

        if (!time.isValid()) throw new UnauthorizedException()

        if (
            !time.isBetween(
                moment().subtract(1, 'minute'),
                moment().add(1, 'minute'),
            )
        )
            throw new UnauthorizedException()

        const publicKey = new PublicKey(paresdMessage.publicKey)

        if (
            !nacl.sign.detached.verify(
                new TextEncoder().encode(message),
                base58.decode(signature),
                publicKey.toBuffer(),
            )
        )
            throw new UnauthorizedException()

        const user = await this.userService.getUser(paresdMessage.publicKey)

        if (!user) throw new UnauthorizedException()

        return user
    }
}