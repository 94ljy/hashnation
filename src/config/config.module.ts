import { Global, Module } from '@nestjs/common'
import { ConfigService } from './config.service'
import { ConfigModule as BaseConfigModule } from '@nestjs/config'
import { appConfigValidate } from './app.config'

@Global()
@Module({
    imports: [
        BaseConfigModule.forRoot({
            envFilePath: ['.env.local', '.env.prod'],
            validate: appConfigValidate,
            // v
        }),
    ],
    providers: [ConfigService],
    exports: [ConfigService],
})
export class ConfigModule {}
