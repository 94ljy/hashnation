import { CURRENCY_TYPE } from '../../common/currency'
import { Wallet } from './wallet.entity'

export class UserWallets {
    constructor(
        public readonly userId: string,
        public readonly wallets: Wallet[],
    ) {}

    hasWallet(currency: CURRENCY_TYPE, address: string): boolean {
        return this.wallets.some(
            (wallet) =>
                wallet.currency === currency && wallet.address === address,
        )
    }

    hasCurrency(currency: CURRENCY_TYPE): boolean {
        return this.wallets.some((wallet) => wallet.currency === currency)
    }
}
