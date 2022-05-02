import { IsNotEmpty, IsString, MaxLength } from 'class-validator'

export class DonateDto {
    @IsString()
    @IsNotEmpty()
    toUsername: string

    @IsString()
    @IsNotEmpty()
    rawTransaction: string

    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    message: string
}
