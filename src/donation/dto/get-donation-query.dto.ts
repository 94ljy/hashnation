import { IsNumber, Max, Min } from 'class-validator'
import { DonationStatus } from '../../repository/entities/donation.entity'

export class GetDonationQueryDto {
    @Min(1)
    @IsNumber()
    page: number

    @Max(20)
    @IsNumber()
    limit: number
}

class DonationInfo {
    id: string
    createdAt: Date
    txHash: string
    fromAddress: string
    toAddress: string
    message: string
    amount: number
    status: DonationStatus
}

export class GetDonationQueryResponseDto {
    page: number
    limit: number
    totalPage: number
    donations: DonationInfo[]
}
