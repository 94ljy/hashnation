import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-local'
import { AuthenticatedUser } from '../../common/authenticated.user'
import { AuthService } from '../auth.service'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService) {
        super({ usernameField: 'username', passwordField: 'password' })
    }

    async validate(
        username: string,
        password: string,
    ): Promise<AuthenticatedUser> {
        try {
            const user = await this.authService.validateUser(username, password)
            return {
                id: user.id,
            }
        } catch (e) {
            throw new UnauthorizedException()
        }
    }
}
