import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { AppModule } from './../src/app.module'
import {
    clusterApiUrl,
    Connection,
    Keypair,
    LAMPORTS_PER_SOL,
    SystemProgram,
    Transaction,
} from '@solana/web3.js'
import nacl from 'tweetnacl'
import base58 from 'bs58'

const key = Keypair.fromSecretKey(
    Buffer.from([
        57, 159, 34, 178, 93, 210, 20, 92, 20, 1, 237, 176, 101, 182, 35, 195,
        136, 35, 144, 104, 87, 218, 163, 123, 123, 59, 187, 232, 87, 187, 119,
        111, 37, 145, 47, 242, 64, 40, 31, 21, 0, 84, 210, 240, 118, 88, 96,
        149, 35, 102, 99, 38, 6, 25, 211, 83, 18, 26, 131, 44, 177, 64, 77, 150,
    ]),
)

const key2 = Keypair.fromSecretKey(
    Buffer.from([
        74, 112, 38, 198, 63, 44, 196, 255, 126, 192, 89, 209, 118, 16, 120,
        111, 242, 136, 215, 194, 20, 148, 168, 178, 87, 250, 84, 230, 52, 17,
        109, 84, 24, 152, 217, 156, 22, 166, 155, 18, 25, 99, 228, 135, 66, 17,
        80, 128, 166, 73, 50, 78, 217, 32, 198, 110, 91, 238, 132, 212, 151, 99,
        217, 249,
    ]),
)

describe('AppController (e2e)', () => {
    let app: INestApplication
    let solanaConn: Connection

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile()

        app = moduleFixture.createNestApplication()
        await app.init()

        solanaConn = new Connection(clusterApiUrl('devnet'))
    })

    // it('/donation/recipient (POST)', async () => {
    //     return request(app.getHttpServer())
    //         .post('/donation/recipient')
    //         .send({
    //             address: key2.publicKey.toString(),
    //             name: 'test2',
    //         })
    //         .expect(201)
    // })

    it('/donation (POST)', async () => {
        const trans = new Transaction()

        trans.add(
            SystemProgram.transfer({
                fromPubkey: key.publicKey,
                toPubkey: key2.publicKey,
                lamports: LAMPORTS_PER_SOL / 1000,
            }),
        )

        const txSig = await solanaConn.sendTransaction(trans, [key])

        await solanaConn.confirmTransaction(txSig)

        const sig = nacl.sign.detached(
            new TextEncoder().encode(txSig),
            key.secretKey,
        )

        return request(app.getHttpServer())
            .post('/donation')
            .send({
                txSignature: txSig,
                message: 'testt',
                signature: base58.encode(sig),
            })
            .expect(201)
    }, 60000)
})
