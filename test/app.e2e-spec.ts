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
import { equal } from 'assert'
import session from 'express-session'
import passport from 'passport'
import FileStore from 'session-file-store'

const f = FileStore(session)

// const key = Keypair.fromSecretKey(
//     Buffer.from([
//         57, 159, 34, 178, 93, 210, 20, 92, 20, 1, 237, 176, 101, 182, 35, 195,
//         136, 35, 144, 104, 87, 218, 163, 123, 123, 59, 187, 232, 87, 187, 119,
//         111, 37, 145, 47, 242, 64, 40, 31, 21, 0, 84, 210, 240, 118, 88, 96,
//         149, 35, 102, 99, 38, 6, 25, 211, 83, 18, 26, 131, 44, 177, 64, 77, 150,
//     ]),
// )

// const key2 = Keypair.fromSecretKey(
//     Buffer.from([
//         74, 112, 38, 198, 63, 44, 196, 255, 126, 192, 89, 209, 118, 16, 120,
//         111, 242, 136, 215, 194, 20, 148, 168, 178, 87, 250, 84, 230, 52, 17,
//         109, 84, 24, 152, 217, 156, 22, 166, 155, 18, 25, 99, 228, 135, 66, 17,
//         80, 128, 166, 73, 50, 78, 217, 32, 198, 110, 91, 238, 132, 212, 151, 99,
//         217, 249,
//     ]),
// )

describe('AppController (e2e)', () => {
    let app: INestApplication
    let solanaConn: Connection
    let newKey: Keypair
    let agent: request.SuperTest<request.Test>

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile()

        app = moduleFixture.createNestApplication()

        app.use(
            session({
                secret: 'secret_test',
                resave: true,
                saveUninitialized: true,
                cookie: {
                    maxAge: 1000 * 60 * 60 * 24,
                },
                // store: new RedisStore({ client: client }),
                store: new f({
                    path: './tmp/sessions',
                }),
            }),
        )

        app.use(passport.initialize())
        app.use(passport.session())

        await app.init()

        solanaConn = new Connection(clusterApiUrl('devnet'))
        newKey = Keypair.generate()

        agent = request.agent(app.getHttpServer())

        console.log(newKey.publicKey.toString())
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

    describe('signup', () => {
        it('/auth/signup (POST)', (done) => {
            request(app.getHttpServer())
                .post('/auth/signup')
                .send({
                    publicKey: newKey.publicKey.toString(),
                    signature: base58.encode(
                        nacl.sign.detached(
                            new TextEncoder().encode(
                                newKey.publicKey.toString(),
                            ),
                            newKey.secretKey,
                        ),
                    ),
                })
                .expect(201, done)
        })
    })

    describe('signin', () => {
        it('/auth/signin (POST)', async () => {
            const publicKey = newKey.publicKey.toString()
            const timestamp = Date.now()

            const message = JSON.stringify({
                publicKey,
                timestamp,
            })

            await agent
                .post('/auth/signin')
                .send({
                    message: message,
                    signature: base58.encode(
                        nacl.sign.detached(
                            new TextEncoder().encode(message),
                            newKey.secretKey,
                        ),
                    ),
                })
                .expect(201)
                .then()

            return agent.get('/auth/me').expect(200).then()
        })
    })

    describe('donate', () => {
        it('/donation/danate (POST)', async () => {
            const from = Keypair.generate()

            const a = await solanaConn.requestAirdrop(
                from.publicKey,
                LAMPORTS_PER_SOL,
            )

            await solanaConn.confirmTransaction(a)

            const trans = new Transaction()

            trans.add(
                SystemProgram.transfer({
                    fromPubkey: from.publicKey,
                    toPubkey: newKey.publicKey,
                    lamports: LAMPORTS_PER_SOL / 1000,
                }),
            )

            trans.recentBlockhash = (
                await solanaConn.getLatestBlockhash()
            ).blockhash
            trans.feePayer = from.publicKey

            trans.sign(from)

            const rawTx = base58.encode(trans.serialize())

            // const txSig = await solanaConn.sendTransaction(trans, [from])

            // await solanaConn.confirmTransaction(txSig)

            let tx = ''

            await request(app.getHttpServer())
                .post('/donation/donate')
                .send({
                    rawTransaction: rawTx,
                    message: 'testt',
                })
                .expect(201)
                .then((res) => {
                    tx = res.body.tx
                })

            // let donationId = ''

            // await agent
            //     .get('/donation')
            //     .expect(200)
            //     .then((res) => {
            //         equal(res.body.txSignature, tx)
            //         donationId = res.body.id
            //     })

            // await agent
            //     .post('/donation/broadcast/success')
            //     .send({
            //         donationId,
            //     })
            //     .expect(201)
            //     .then()
        }, 60000)
    })

    // describe('getDonations', () => {
    //     it('/donation (GET)', () => {
    //         request(app.getHttpServer()).get('/donation').expect(200)
    //     })
    // })

    // it('/auth/signin (POST)', async () => {
    //     const publicKey = newKey.publicKey.toString()
    //     const timestamp = Date.now()

    //     const message = JSON.stringify({
    //         publicKey,
    //         timestamp,
    //     })

    //     return request(app.getHttpServer())
    //         .post('/auth/signin')
    //         .send({
    //             message: message,
    //             signature: base58.encode(
    //                 nacl.sign.detached(
    //                     new TextEncoder().encode(message),
    //                     newKey.secretKey,
    //                 ),
    //             ),
    //         })
    //         .expect(201)
    // })

    // it('/auth (GET)', async () => {
    //     return request(app.getHttpServer()).get('/auth').expect(200)
    // })
})
