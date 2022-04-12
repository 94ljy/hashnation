import { Body, Controller, Post } from '@nestjs/common'
import { DonationService } from './donation.service'
import { DonationDto } from './dto/donation.dto'

@Controller('donation')
export class DonationController {
    constructor(private readonly donationService: DonationService) {}

    @Post()
    async donation(@Body() donationDto: DonationDto) {
        return await this.donationService.donation(
            donationDto.txSignature,
            donationDto.message,
        )
    }
}
