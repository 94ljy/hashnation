import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import CookieParser from 'cookie-parser'
import session from 'express-session'
import passport from 'passport'
import FileStore from 'session-file-store'

const f = FileStore(session)

async function bootstrap() {
    const app = await NestFactory.create(AppModule)
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
        }),
    )

    app.use(
        session({
            secret: 'secret_test',
            resave: true,
            saveUninitialized: true,
            cookie: {
                maxAge: 1000 * 60 * 60 * 24,
                httpOnly: true,
            },
            // store: new RedisStore({ client: client }),
            store: new f({
                path: './tmp/sessions',
            }),
        }),
    )

    app.use(passport.initialize())
    app.use(passport.session())

    await app.listen(3000)
}
bootstrap()
