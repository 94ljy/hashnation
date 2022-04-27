import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from './auth/auth.module'
import { SnakeNamingStrategy } from 'typeorm-naming-strategies'
import { APP_GUARD } from '@nestjs/core'
import { AuthenticatedGuard } from './auth/guard/auth.guard'
import { UserModule } from './user/user.module'
import { WalletModule } from './wallet/wallet.module'
import { DonationModule } from './donation/donation.module'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { ConfigModule } from '@nestjs/config'
import winston from 'winston'
import { WinstonModule, utilities } from 'nest-winston'
import { WidgetModule } from './widget/widget.module'
import appConfig from './config/app.config'

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
        WinstonModule.forRoot({
            transports: [
                new winston.transports.Console({
                    level: 'silly',
                    format: winston.format.combine(
                        winston.format.timestamp(),
                        // winston.format.ms(),
                        utilities.format.nestLike('App', { prettyPrint: true }),
                    ),
                }),
            ],
        }),
        AuthModule,
        UserModule,
        WalletModule,
        DonationModule,
        EventEmitterModule.forRoot(),
        ConfigModule.forRoot({
            load: [appConfig],
            isGlobal: true,
            envFilePath: ['.env.local', '.env.pord'],
            // v
        }),
        WidgetModule,
    ],
    controllers: [],
    providers: [{ provide: APP_GUARD, useClass: AuthenticatedGuard }],
})
export class AppModule {}
