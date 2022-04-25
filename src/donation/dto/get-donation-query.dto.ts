import { IsNumber, Max, Min } from 'class-validator'

export class GetDonationQueryDto {
    @IsNumber()
    @Min(1)
    page = 1

    @IsNumber()
    @Max(20)
    limit = 10
}
