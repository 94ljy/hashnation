import {
    createParamDecorator,
    ExecutionContext,
    InternalServerErrorException,
} from '@nestjs/common'

export const User = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest()

        const user = request.user

        if (user.id === undefined)
            throw new InternalServerErrorException('User id is undefined')

        return user
    },
)
