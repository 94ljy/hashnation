import { Injectable } from '@nestjs/common'

import { ConfigService as BaseConfigService } from '@nestjs/config'
import { AppConfig } from './app.config'

@Injectable()
export class ConfigService {
    constructor(private readonly configService: BaseConfigService<AppConfig>) {}

    get(key: keyof AppConfig) {
        return this.configService.get(key, { infer: true })
    }
}
