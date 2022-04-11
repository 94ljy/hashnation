import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserModule } from './user/user.module'
import { AuthModule } from './auth/auth.module'
import { DonationModule } from './donation/donation.module'
import { SnakeNamingStrategy } from 'typeorm-naming-strategies'

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'sqlite',
            database: 'db.sqlite',
            entities: ['dist/**/*.entity{.ts,.js}'],
            namingStrategy: new SnakeNamingStrategy(),
            synchronize: true,
        }),
        UserModule,
        AuthModule,
        DonationModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
