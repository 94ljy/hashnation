import { IsNotEmpty, IsString } from 'class-validator'

export class AddUserWalletDto {
    @IsString()
    @IsNotEmpty()
    address: string

    @IsString()
    @IsNotEmpty()
    signature: string
}

export class AddUserWalletResponseDto {
    walletId: string
    address: string
}
