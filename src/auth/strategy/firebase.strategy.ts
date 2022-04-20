import { BadRequestException, Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt } from 'passport-jwt'
import {
    FirebaseAuthStrategy,
    FirebaseUser,
} from '@tfarras/nestjs-firebase-auth'
import { AuthenticatedUser } from '../../common/authenticated.user'

@Injectable()
export class FirebaseStrategy extends PassportStrategy(
    FirebaseAuthStrategy,
    'firebase',
) {
    public constructor() {
        super({
            extractor: ExtractJwt.fromAuthHeaderAsBearerToken(),
        })
    }

    async validate(payload: FirebaseUser): Promise<AuthenticatedUser> {
        if (!payload.email_verified) {
            throw new BadRequestException('Email not verified')
        }

        return {
            id: payload.sub,
        }
    }
}
