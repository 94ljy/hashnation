import { Controller, Get, Inject, Logger, LoggerService } from '@nestjs/common'
import { Public } from '../auth/guard/auth.guard'
import { AuthenticatedUser } from '../common/authenticated.user'
import { User } from '../common/user.decorator'
import { UserService } from './user.service'
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston'

@Controller('user')
export class UserController {
    private readonly logger2 = new Logger(UserController.name)
    constructor(
        private readonly userService: UserService,
        @Inject(WINSTON_MODULE_NEST_PROVIDER)
        private readonly logger: LoggerService,
    ) {}

    @Get('/info')
    async getUserInfo(@User() user: AuthenticatedUser) {
        return this.userService.getUserInfo(user.id)
    }

    @Public()
    @Get('/test')
    async test() {
        this.logger.log('test')
        this.logger.error('test')
        this.logger2.log('test2')
        this.logger2.error(process.pid)
        return {}
    }
}
