import { registerAs } from '@nestjs/config'

export default registerAs('app', () => ({
    port: process.env.PORT || 3000,
    cookieSecret: process.env.COOKIE_SECRET,
    solanaCluster: process.env.SOLANA_CLUSTER,
}))
