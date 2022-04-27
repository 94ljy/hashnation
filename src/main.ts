import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import CookieParser from 'cookie-parser'
import session from 'express-session'
import passport from 'passport'
import FileStore from 'session-file-store'
import appConfig from './config/app.config'
import { ConfigType } from '@nestjs/config'

const f = FileStore(session)

async function bootstrap() {
    const app = await NestFactory.create(AppModule)

    const appConfigService = app.get<ConfigType<typeof appConfig>>(
        appConfig.KEY,
    )

    app.setGlobalPrefix('/v1/api/')

    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
        }),
    )

    app.use(
        session({
            secret: appConfigService.cookieSecret,
            resave: false,
            saveUninitialized: false,
            cookie: {
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
