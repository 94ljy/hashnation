import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from './auth/auth.module'
import { APP_GUARD } from '@nestjs/core'
import { AuthenticatedGuard } from './auth/guard/auth.guard'
import { UserModule } from './user/user.module'
import { WalletModule } from './wallet/wallet.module'
import { DonationModule } from './donation/donation.module'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { WidgetModule } from './widget/widget.module'
import { ConfigModule } from './config/config.module'
import { LoggerModule } from './logger/logger.module'
import { ConfigService } from './config/config.service'

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                type: 'sqlite',
                database: 'db.sqlite',
                entities: [__dirname + '/**/*.entity{.ts,.js}'],
                keepConnectionAlive: true,
                logging: configService.get('NODE_ENV') === 'development',
                synchronize: configService.get('NODE_ENV') === 'development',
            }),
        }),
        LoggerModule,
        AuthModule,
        UserModule,
        WalletModule,
        DonationModule,
        EventEmitterModule.forRoot(),
        ConfigModule,
        WidgetModule,
    ],
    controllers: [],
    providers: [{ provide: APP_GUARD, useClass: AuthenticatedGuard }],
})
export class AppModule {}
