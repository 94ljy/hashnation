import { Keypair } from '@solana/web3.js'
import base58 from 'bs58'
import nacl from 'tweetnacl'
import { CURRENCY_TYPE } from '../../common/currency'
import { CREATE_USER_WALLSET_MESSAGE, Wallet } from '../domain/wallet.entity'

describe('wallet domain', () => {
    const userId = 'test-user'
    let keypair: Keypair

    beforeEach(() => {
        keypair = Keypair.generate()
    })

    it('sol wallet validate fail', () => {
        const solWallet = Wallet.createWallet(
            CURRENCY_TYPE.SOL,
            keypair.publicKey.toString(),
            userId,
        )

        expect(() => solWallet.validate('123')).toThrow()
    })

    it('sol wallet validate success', () => {
        const solWallet = Wallet.createWallet(
            CURRENCY_TYPE.SOL,
            keypair.publicKey.toString(),
            userId,
        )

        const signature = nacl.sign.detached(
            CREATE_USER_WALLSET_MESSAGE,
            keypair.secretKey,
        )

        expect(() => solWallet.validate(base58.encode(signature))).not.toThrow()
    })
})
