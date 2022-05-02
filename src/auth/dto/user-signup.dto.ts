import { ApiProperty } from '@nestjs/swagger'
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

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @Length(6, 64)
    password: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    @MaxLength(64)
    email: string
}
