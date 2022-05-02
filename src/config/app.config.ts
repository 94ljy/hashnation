import { registerAs } from '@nestjs/config'
import { plainToClass } from 'class-transformer'
import { IsEnum, IsNumber, IsString, validateSync } from 'class-validator'

enum SOLANA_CLUSTER {
    DEVNET = 'devnet',
    TESTNET = 'testnet',
    MAINNET = 'mainnet-beta',
}

export class AppConfig {
    @IsString()
    NODE_ENV: string

    @IsNumber()
    PORT: number

    @IsString()
    COOKIE_SECRET: string

    @IsEnum(SOLANA_CLUSTER)
    SOLANA_CLUSTER: SOLANA_CLUSTER
}

export const appConfigValidate = (config: any) => {
    const validatedConfig = plainToClass(AppConfig, config, {
        enableImplicitConversion: true,
    })

    const errors = validateSync(validatedConfig, {
        skipMissingProperties: false,
        whitelist: true,
    })

    if (errors.length > 0) {
        throw new Error(errors.toString())
    }

    return validatedConfig
}

// export const appConfigLoad = () => ({
//     nodeEnv: process.env.NODE_ENV,
//     port: process.env.PORT || 3000,
//     cookieSecret: process.env.COOKIE_SECRET,
//     solanaCluster: process.env.SOLANA_CLUSTER,
// })

// export default registerAs('app', () => ({
//     nodeEnv: process.env.NODE_ENV,
//     port: process.env.PORT || 3000,
//     cookieSecret: process.env.COOKIE_SECRET,
//     solanaCluster: process.env.SOLANA_CLUSTER,
// }))
