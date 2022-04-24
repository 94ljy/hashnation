import { Body, Controller, Post } from '@nestjs/common'
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
        return {}
    }
}
