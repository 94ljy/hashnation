import { walletType } from '../entity/wallet.entity'

export class AddCreatorWalletDto {
    type: walletType
    address: string
    signature: string
}
