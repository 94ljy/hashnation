import { Controller, Get } from '@nestjs/common'
import { AuthenticatedUser } from '../common/authenticated.user'
import { User } from '../common/user.decorator'
import { UserService } from './user.service'

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get('/info')
    async getUserInfo(@User() user: AuthenticatedUser) {
        return this.userService.getUserInfo(user.id)
    }
}
