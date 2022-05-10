import { IsEnum, IsNotEmpty, IsString } from 'class-validator'
import { CURRENCY_TYPE } from '../../common/currency'

export class AddUserWalletDto {
    @IsEnum(CURRENCY_TYPE)
    currency: CURRENCY_TYPE

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
