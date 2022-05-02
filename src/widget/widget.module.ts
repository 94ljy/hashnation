import { Module } from '@nestjs/common'
import { WidgetService } from './widget.service'
import { WidgetController } from './widget.controller'
import { WidgetGateway } from './widget.gateway'
import { UserModule } from '../user/user.module'

@Module({
    imports: [UserModule],
    controllers: [WidgetController],
    providers: [WidgetService, WidgetGateway],
})
export class WidgetModule {}
