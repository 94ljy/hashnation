import { Module } from '@nestjs/common'
import { WalletService } from './wallet.service'
import { WalletController } from './wallet.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Wallet } from './domain/wallet.entity'
import { UserModule } from '../user/user.module'
import { WalletRepository } from './repository/wallet.repository'

@Module({
    imports: [TypeOrmModule.forFeature([WalletRepository]), UserModule],
    controllers: [WalletController],
    providers: [WalletService],
    exports: [WalletService],
})
export class WalletModule {}
