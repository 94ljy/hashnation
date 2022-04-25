import { Body, Controller, Get, Post } from '@nestjs/common'
import { AuthenticatedUser } from '../common/authenticated.user'
import { User } from '../common/user.decorator'
import { AddUserWalletDto } from './dto/add-user-wallet.dto'
import { WalletService } from './wallet.service'

@Controller('wallet')
export class WalletController {
    constructor(private readonly walletService: WalletService) {}

    @Post()
    async createWallet(
        @User() user: AuthenticatedUser,
        @Body() addUserWalletDto: AddUserWalletDto,
    ) {
        await this.walletService.createWallet(user.id, addUserWalletDto.address)
        return {}
    }

    @Get()
    async getUserWallet(@User() user: AuthenticatedUser) {
        return this.walletService.getUserWallet(user.id)
    }
}
