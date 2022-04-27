import { Controller, Post } from '@nestjs/common'
import { AuthenticatedUser } from '../common/authenticated.user'
import { User } from '../common/user.decorator'
import { WidgetService } from './widget.service'

@Controller('widget')
export class WidgetController {
    constructor(private readonly widgetService: WidgetService) {}

    @Post('/pause')
    async widgetPause(@User() user: AuthenticatedUser) {
        this.widgetService.widgetPause(user.id)
    }

    @Post('/play')
    async widgetPlay(@User() user: AuthenticatedUser) {
        this.widgetService.widgetPlay(user.id)
    }

    @Post('/skip')
    async widgetSkip(@User() user: AuthenticatedUser) {
        this.widgetService.widgetSkip(user.id)
    }
}
