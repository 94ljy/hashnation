import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import CookieParser from 'cookie-parser'
import session from 'express-session'
import passport from 'passport'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)
    // app.useGlobalPipes(
    //     new ValidationPipe({
    //         transform: true,
    //     }),
    // )

    app.use(
        session({
            secret: 'secret_test',
            resave: false,
            saveUninitialized: false,
            // cookie: {
            //     maxAge: 1000 * 60 * 60 * 24,
            // },
            // store: new RedisStore({ client: client }),
        }),
    )
    app.use(passport.initialize())
    app.use(passport.session())

    await app.listen(3000)
}
bootstrap()
