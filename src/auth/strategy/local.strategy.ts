import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-local'
import { AuthService } from '../auth.service'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService) {
        super({ usernameField: 'message', passwordField: 'signature' })
    }

    async validate(message: string, signature: string): Promise<any> {
        return await this.authService.validateUser(message, signature)
    }
}