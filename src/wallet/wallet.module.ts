import { Module } from '@nestjs/common'
import { WalletService } from './wallet.service'
import { WalletController } from './wallet.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserWallet } from '../entities/wallet.entity'
import { UserModule } from '../user/user.module'

@Module({
    imports: [TypeOrmModule.forFeature([UserWallet]), UserModule],
    controllers: [WalletController],
    providers: [WalletService],
    exports: [WalletService],
})
export class WalletModule {}
