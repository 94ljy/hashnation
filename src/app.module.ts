import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserModule } from './user/user.module'
import { AuthModule } from './auth/auth.module'
import { DonationModule } from './donation/donation.module'
import { SnakeNamingStrategy } from 'typeorm-naming-strategies'
import { APP_GUARD } from '@nestjs/core'
import { AuthenticatedGuard } from './auth/guard/auth.guard'
import { FirebaseAdminModule } from '@tfarras/nestjs-firebase-admin'
import * as admin from 'firebase-admin'

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'sqlite',
            database: 'db.sqlite',
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            namingStrategy: new SnakeNamingStrategy(),
            keepConnectionAlive: true,
            synchronize: true,
        }),
        UserModule,
        AuthModule,
        DonationModule,
        FirebaseAdminModule.forRoot({
            credential: admin.credential.cert({
                type: 'service_account',
                project_id: 'hashnation-6bc54',
                private_key_id: '7efcd6fe02235f18ae6a80a42d91bfa6d53ec268',
                private_key:
                    '-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCzZ/kcG8roXW5U\nsD8XrCLHRsCYNMMX0dH39pXAABY2BXe7MpYAtDR5ZvpGKxU/2tfABvwwuQFV98aJ\nT0fmbQT7++AMIcJTWG8a3os350OPp2Fzv7lUS8haZWAhQz6u1bKBK5MhZCb4M1ji\nKLdWeDKd7OqTOjMlngbS6F453GLraRF6ohmOhV/WZBic1DDUtk0EoxdjpHFrMbOQ\niCV8KD2rceuQJ8TxZ+le54qC7RLiPLNNApk5aWKsug9jZRTbIMrqhC/Xf91zBlxf\nYpp4Xa87SIU3RRR+qq3c0V8GiizoONYQfi+Dy3eB7lMrcSLWvF77I4OAdyGepUN0\n3ZUYvRi3AgMBAAECggEAB5BLnVbCoDdILoPbtRjJwpMGDaSz0O5Epuqbd6PJS+/B\nE4BXeKIgUDn6NTkdxTppvCvPOBKkrsYqdaGFC37vJdyBnqFRuwfQb1aQkgPLAmRx\nJFsh6h7jzIPXoK9gFijmRLHcmxzI08/+YFKNIDUjFStm3Fwoyd42tW+cgV38QaZz\nL52DP5D6fr7TT15EA29yrHOSFCmzg0qxg6PbcVBovZ7Hse52tsHuzkTbkj2jFnpo\n9E78FCL/MC5VZ8bUPtCvgMFIxU8I+xv71doGgUR8pNeopearkcYkbAK+WI8kmx1A\nQUZdLBH2xiXIGGy+JIfmj+t+0qzN6TAQlqLTxC17eQKBgQDtDDzC2pQwi06xefCf\nG9WBch1fU+7Uo0nCCGGKn45PRjQc9wq1K1aMUD3LvfYhqHNMUa2bUY2SxuK5kA4L\nCBONLONLybGN+0FDcSsLL67+jj1KMspv4mikT/e1OXRLNviellFc1hZr/JCOgswS\nsQljFCfBnjyspvvFvM5WqA/86wKBgQDBv/VVfbga17N2rxyzYgUDLGVtOPXZ1v1F\niYGVGfOFgni0fyfvUx5IYIG741XhjoSdHf1mIQS8Dbno8rpEgbV4KfWemhmz+55H\n67px+nvsrz1PcSGnEiOhBgZhsGkRkfKKEy4r3PKUusaJP8bULOwMsGfQgc+qnTwu\nb5EDa3bwZQKBgDc2r3xvby7zc8vw7DQTRqLVErRel3Wd5xMz4oxoZ7xdTMwmWq8i\nPhGGqy4mvArQ8rInIDnaQBCdFLhGLo8xPWSXvQWtIBdDG8t6s5zyaV9PgEUlGXQA\nF4GWQstKa6UNU9GUj7UBBM34US9wldoQtHAIhM4bbmSErIY9WQ5kLP0rAoGAVgqZ\nOM4L5F/GIv7BECiHcVFV+ZtCEuuWrjrSgRR1QOUgFYgig/W1jQ7OjlH24aQY4G1h\nCum+4IR3+ytP7PxtSl/X5AcrQvKK6AWXVuaWAhYQdCcZeshjai7yxo9BGbxmqUq7\nRl9omwQXBvx7n94TNc9hSwda4bnR8A07qPkgaMECgYBPuwnx9vvb9MUUqGVlIiHv\nCniomlT5NP/b+wm70Dq9G8G9RKAyDPclKbtWtzJJDimWZCa/gAxJdfHof3FMrBHo\nXjr6IZGpXyxs7cyU7Nf487eb34zuKZAGpn9UEX4+FQepyWJui/IFytxuXeML01zf\n88f/7QfeRljNlUsuZCF03Q==\n-----END PRIVATE KEY-----\n',
                client_email:
                    'firebase-adminsdk-s5yci@hashnation-6bc54.iam.gserviceaccount.com',
                client_id: '105829412653495253164',
                auth_uri: 'https://accounts.google.com/o/oauth2/auth',
                token_uri: 'https://oauth2.googleapis.com/token',
                auth_provider_x509_cert_url:
                    'https://www.googleapis.com/oauth2/v1/certs',
                client_x509_cert_url:
                    'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-s5yci%40hashnation-6bc54.iam.gserviceaccount.com',
            } as any),
        }),
    ],
    controllers: [],
    providers: [{ provide: APP_GUARD, useClass: AuthenticatedGuard }],
})
export class AppModule {}
