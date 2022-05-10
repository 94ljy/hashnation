import { IsNotEmpty, IsString, MaxLength } from 'class-validator'

export class SolDonateDto {
    @IsString()
    @IsNotEmpty()
    toUsername: string

    @IsString()
    @IsNotEmpty()
    rawTransaction: string

    @IsString()
    @MaxLength(50)
    message: string
}
