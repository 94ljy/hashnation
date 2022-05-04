import { AbstractRepository } from 'typeorm'
import { Wallet } from './entities/wallet.entity'

export class WalletRepository extends AbstractRepository<Wallet> {
    async createWallet(wallet: Wallet): Promise<Wallet> {
        return this.repository.save(wallet)
    }

    async findWalletByUserId(userId: string): Promise<Wallet[]> {
        return await this.repository.find({ where: { userId } })
    }

    async findWalletByAddress(
        userId: string,
        address: string,
    ): Promise<Wallet | null> {
        return (
            (await this.repository.findOne({ where: { userId, address } })) ??
            null
        )
    }

    async findWalletByWalletId(
        userId: string,
        walletId: string,
    ): Promise<Wallet | null> {
        return (
            (await this.repository.findOne({
                where: { userId, id: walletId },
            })) ?? null
        )
    }

    async updateWalletDeletedAt(walletId: string, date: Date) {
        return await this.repository.update(walletId, { deletedAt: date })
    }
}
