import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { UserModule } from '../user/user.module'
import { PassportModule } from '@nestjs/passport'
import { LocalStrategy } from './strategy/local.strategy'
import { SessionSerializer } from './session.serializer'
import { FirebaseStrategy } from './strategy/firebase.strategy'

@Module({
    imports: [UserModule, PassportModule],
    controllers: [AuthController],
    providers: [AuthService, FirebaseStrategy],
})
export class AuthModule {}
