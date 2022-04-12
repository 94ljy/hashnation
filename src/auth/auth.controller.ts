import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { UserSignupDto } from './dto/user-signup.dto'
import { LoginGuard } from './guard/login.guard'

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    // @UseGuards(AuthGuard('local'))
    @UseGuards(LoginGuard)
    @Post('/signin')
    async login(@Req() req: any) {
        console.log(req.user)

        return {}
    }

    @Post('signup')
    async signup(@Body() userSignupDto: UserSignupDto) {
        await this.authService.signup(
            userSignupDto.publicKey,
            userSignupDto.signature,
        )
        return {
            message: 'successfully signed up',
        }
    }
}
