import { Body, Controller, Delete, Get, Post } from '@nestjs/common'
import { AuthenticatedUser } from '../common/authenticated.user'
import { CURRENCY_TYPE } from '../common/currency'
import { User } from '../common/user.decorator'
import {
    AddUserWalletDto,
    AddUserWalletResponseDto,
} from './dto/add-user-wallet.dto'
import {
    DeleteUserWalletDto,
    DeleteUserWalletResponseDto,
} from './dto/delete-user-wallet.dto'
import { UserWalletResponseDto } from './dto/user-wallet.dto'
import { WalletService } from './wallet.service'

@Controller('wallet')
export class WalletController {
    constructor(private readonly walletService: WalletService) {}

    @Post('')
    async createWallet(
        @User() user: AuthenticatedUser,
        @Body() addUserWalletDto: AddUserWalletDto,
    ): Promise<AddUserWalletResponseDto> {
        const newWallet = await this.walletService.createWallet(
            user.id,
            addUserWalletDto.currency,
            addUserWalletDto.address,
            addUserWalletDto.signature,
        )

        return {
            walletId: newWallet.id,
            address: newWallet.address,
        }
    }

    @Get()
    async getUserWallet(
        @User() user: AuthenticatedUser,
    ): Promise<UserWalletResponseDto[]> {
        const userWallets = await this.walletService.getUserWallets(user.id)

        return userWallets.wallets.map<UserWalletResponseDto>((wallet) => ({
            walletId: wallet.id,
            address: wallet.address,
        }))
    }

    @Delete()
    async deleteUserWallet(
        @User() user: AuthenticatedUser,
        deleteUserWalletDto: DeleteUserWalletDto,
    ): Promise<DeleteUserWalletResponseDto> {
        const deletedWallet = await this.walletService.deleteUserWallet(
            user.id,
            deleteUserWalletDto.walletId,
        )

        return {
            walletId: deleteUserWalletDto.walletId,
        }
    }
}
