import { Module, Global } from '@nestjs/common'
import { utilities, WinstonModule } from 'nest-winston'
import winston from 'winston'
import { AppLogger } from './logger.service'

@Global()
@Module({
    imports: [
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
    ],
    providers: [AppLogger],
    exports: [AppLogger],
})
export class LoggerModule {}
