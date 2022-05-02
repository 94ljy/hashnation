import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { PassportModule } from '@nestjs/passport'
import { LocalStrategy } from './strategy/local.strategy'
import { SessionSerializer } from './session.serializer'
import { UserModule } from 'src/user/user.module'

@Module({
    imports: [PassportModule.register({ session: true }), UserModule],
    controllers: [AuthController],
    providers: [
        AuthService,
        // FirebaseStrategy,
        LocalStrategy,
        SessionSerializer,
    ],
})
export class AuthModule {}
