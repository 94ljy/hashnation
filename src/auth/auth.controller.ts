import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { AuthService } from './auth.service'
import { UserSignupDto } from './dto/user-signup.dto'

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @UseGuards(AuthGuard('local'))
    @Post('/login')
    async login(@Req() req: any) {
        return req.user
    }

    @Post('signup')
    async signup(@Body() userSignupDto: UserSignupDto) {
        await this.authService.signup(
            userSignupDto.username,
            userSignupDto.publicKey,
        )
        return {
            message: 'successfully signed up',
        }
    }
}
