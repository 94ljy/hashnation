import { Module } from '@nestjs/common'
import { CreatorService } from './creator.service'
import { CreatorController } from './creator.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CreatorEntity } from './entity/creator.entity'
import { CreatorWalletEntity } from './entity/wallet.entity'

@Module({
    imports: [TypeOrmModule.forFeature([CreatorEntity, CreatorWalletEntity])],
    controllers: [CreatorController],
    providers: [CreatorService],
    exports: [CreatorService],
})
export class CreatorModule {}
