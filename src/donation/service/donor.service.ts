import { BadRequestException, Injectable } from '@nestjs/common'
import { ns64, struct, u32 } from '@solana/buffer-layout'
import { UserService } from '../../user/user.service'
import { WalletService } from '../../wallet/wallet.service'

export const TRANSFER_INSTRUCTION_INDEX = 2

export const TRANSFER_INSTRUCTION = struct<{
    instruction: number
    lamports: number
}>([u32('instruction'), ns64('lamports')])

@Injectable()
export class DonorService {
    constructor(
        private readonly userService: UserService,
        private readonly walletService: WalletService,
    ) {}

    async getCreatorInfo(username: string) {
        const user = await this.userService.getUserByUsername(username)

        if (!user) throw new BadRequestException(`User ${username} not found`)

        const wallets = await this.walletService.getUserWallet(user.id)

        return {
            username: user.username,
            wallets: wallets.map((item) => ({
                address: item.address,
            })),
        }
    }
}
