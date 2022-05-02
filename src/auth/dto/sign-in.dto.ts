import { IsNotEmpty, IsString, Length } from 'class-validator'

export class SignInDto {
    @IsString()
    @IsNotEmpty()
    @Length(4, 32)
    username: string

    @IsString()
    @IsNotEmpty()
    @Length(6, 64)
    password: string
}
