import { IsNotEmpty, IsString } from 'class-validator'

export class DeleteUserWalletDto {
    @IsString()
    @IsNotEmpty()
    walletId: string
}

export class DeleteUserWalletResponseDto {
    walletId: string
}
