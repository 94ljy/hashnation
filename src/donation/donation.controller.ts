import { Body, Controller, Get, Post } from '@nestjs/common'
import { DonationService } from './service/donation.service'
import { DonateDto } from './dto/donate.dto'
import { DonorService } from './service/donor.service'
import { Public } from 'src/auth/guard/auth.guard'

@Controller('donation')
export class DonationController {
    constructor(
        private readonly donationService: DonationService,
        private readonly donorService: DonorService,
    ) {}

    // @Public()
    // @Get('/:username/info')
    // async getDonationInfo() {
    //     return {}
    // }

    // @Post('donate')
    // async donate(@Body() donateDto: DonateDto) {
    //     return this.donorService.donate(
    //         donateDto.toUsername,
    //         donateDto.rawTransaction,
    //         donateDto.message,
    //     )
    // }
}
