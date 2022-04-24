import {
    CanActivate,
    ExecutionContext,
    Injectable,
    SetMetadata,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'

export const IS_PUBLIC_KEY = 'isPublic'
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true)

// @Injectable()
// export class AuthenticatedGuard implements CanActivate {
//     constructor(private reflector: Reflector) {}

//     async canActivate(context: ExecutionContext) {
//         const isPublic = this.reflector.getAllAndOverride<boolean>(
//             IS_PUBLIC_KEY,
//             [context.getHandler(), context.getClass()],
//         )

//         if (isPublic) {
//             return true
//         }

//         const request = context.switchToHttp().getRequest()
//         return request.isAuthenticated()
//     }
// }

@Injectable()
export class AuthenticatedGuard extends AuthGuard('local') {
    constructor(private reflector: Reflector) {
        super()
    }

    async canActivate(context: ExecutionContext) {
        const isPublic = this.reflector.getAllAndOverride<boolean>(
            IS_PUBLIC_KEY,
            [context.getHandler(), context.getClass()],
        )

        if (isPublic) {
            return true
        }

        return super.canActivate(context) as any
    }
}
