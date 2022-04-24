import { Body, Controller, Post } from '@nestjs/common'
import { DonationService } from './service/donation.service'
import { DonateDto } from './dto/donate.dto'
import { DonorService } from './service/donor.service'

@Controller('donation')
export class DonationController {
    constructor(
        private readonly donationService: DonationService,
        private readonly donorService: DonorService,
    ) {}

    @Post('donate')
    async donate(@Body() donateDto: DonateDto) {
        return this.donorService.donate(
            donateDto.toUsername,
            donateDto.rawTransaction,
            donateDto.message,
        )
    }
}
