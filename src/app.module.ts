import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserModule } from './user/user.module'
import { AuthModule } from './auth/auth.module'
import { DonationModule } from './donation/donation.module'
import { SnakeNamingStrategy } from 'typeorm-naming-strategies'
import { APP_GUARD } from '@nestjs/core'
import { AuthenticatedGuard } from './auth/guard/auth.guard'

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'sqlite',
            database: 'db.sqlite',
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            namingStrategy: new SnakeNamingStrategy(),
            keepConnectionAlive: true,
            synchronize: true,
        }),
        UserModule,
        AuthModule,
        DonationModule,
    ],
    controllers: [],
    providers: [{ provide: APP_GUARD, useClass: AuthenticatedGuard }],
})
export class AppModule {}
