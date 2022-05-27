import { Injectable } from '@nestjs/common'
import { Cluster, clusterApiUrl, Connection } from '@solana/web3.js'
import { ConfigService } from '../../config/config.service'

@Injectable()
export class SolanaConnection extends Connection {
    constructor(private readonly configService: ConfigService) {
        const url = clusterApiUrl(
            configService.get('SOLANA_CLUSTER') as Cluster,
        )
        super(url)
    }
}
