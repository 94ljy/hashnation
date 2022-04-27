import {
    IsEmail,
    IsNotEmpty,
    IsString,
    Length,
    MaxLength,
} from 'class-validator'

export class UserSignUpDto {
    @IsString()
    @IsNotEmpty()
    @Length(4, 32)
    username: string

    @IsString()
    @IsNotEmpty()
    @Length(6, 64)
    password: string

    @IsString()
    @IsNotEmpty()
    @IsEmail()
    @MaxLength(64)
    email: string
}
