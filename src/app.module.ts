import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserModule } from './user/user.module'
import { AuthModule } from './auth/auth.module'

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'sqlite',
            database: 'db.sqlite',
            entities: ['dist/**/*.entity{.ts,.js}'],
            synchronize: true,
        }),
        UserModule,
        AuthModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
