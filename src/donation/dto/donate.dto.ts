import { IsNotEmpty, IsString } from 'class-validator'

export class DonateDto {
    @IsString()
    @IsNotEmpty()
    toUsername: string

    @IsString()
    @IsNotEmpty()
    rawTransaction: string

    @IsString()
    @IsNotEmpty()
    message: string
}
