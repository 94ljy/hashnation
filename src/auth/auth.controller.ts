import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Req,
    UnauthorizedException,
    UseGuards,
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { UserSignupDto } from './dto/user-signup.dto'
import { Public } from './guard/auth.guard'
import { LoginGuard } from './guard/login.guard'

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    // @UseGuards(AuthGuard('local'))
    @Public()
    @UseGuards(LoginGuard)
    @Post('/signin')
    async signin(@Req() req: any) {
        return {}
    }

    // @Public()
    // @Post('signup')
    // async signup(@Body() userSignupDto: UserSignupDto) {
    //     await this.authService.signup(
    //         userSignupDto.publicKey,
    //         userSignupDto.signature,
    //     )
    //     return {
    //         message: 'successfully signed up',
    //     }
    // }

    // @Public()
    // @Get('/signup/check-publickey/:publicKey')
    // async checkkey(@Param('publicKey') publicKey: string) {
    //     return this.authService.checkPulbicKey(publicKey)
    // }

    @Public()
    @Post('/signout')
    async signout(@Req() req: any) {
        req.logout()
        return {}
    }

    @Get('/me')
    async me() {
        return {
            message: 'successfully logged in',
        }
    }
}
