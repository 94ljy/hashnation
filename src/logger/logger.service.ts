import { Inject, Injectable, LoggerService, LogLevel } from '@nestjs/common'
import {
    WinstonLogger,
    WINSTON_MODULE_NEST_PROVIDER,
    WINSTON_MODULE_PROVIDER,
} from 'nest-winston'

@Injectable()
export class AppLogger implements LoggerService {
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService

    log(message: any, ...optionalParams: any[]): any {
        return this.logger.log(message, ...optionalParams)
    }

    error(message: any, ...optionalParams: any[]): any {
        return this.logger.error(message, ...optionalParams)
    }

    warn(message: any, ...optionalParams: any[]): any {
        return this.logger.warn(message, ...optionalParams)
    }

    debug?(message: any, ...optionalParams: any[]): any {
        if (this.logger.debug)
            return this.logger.debug(message, ...optionalParams)
    }

    verbose?(message: any, ...optionalParams: any[]): any {
        if (this.logger.verbose)
            return this.logger.verbose(message, ...optionalParams)
    }

    setLogLevels?(levels: LogLevel[]): any {
        if (this.logger.setLogLevels) return this.logger.setLogLevels(levels)
    }
}
