import 'reflect-metadata'
import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import session from 'express-session'
import passport from 'passport'
import FileStore from 'session-file-store'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { ConfigService } from './config/config.service'

const f = FileStore(session)

async function bootstrap() {
    const app = await NestFactory.create(AppModule)

    const configService = app.get<ConfigService>(ConfigService)

    app.setGlobalPrefix('/v1/api/')

    app.useGlobalPipes(
        new ValidationPipe({
            disableErrorMessages:
                configService.get('NODE_ENV') === 'production',
            // whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
            transformOptions: {
                enableImplicitConversion: true,
            },
        }),
    )

    app.use(
        session({
            secret: configService.get('COOKIE_SECRET'),
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

    if (configService.get('NODE_ENV') === 'development') {
        SwaggerModule.setup(
            'api',
            app,
            SwaggerModule.createDocument(
                app,
                new DocumentBuilder()
                    .setTitle('Hashnation API')
                    .setDescription('Hashnation API')
                    .setVersion('1.0')
                    .addCookieAuth()
                    .build(),
            ),
        )
    }

    app.use(passport.initialize())
    app.use(passport.session())

    await app.listen(3000)
}
bootstrap()
