import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common'
import { DonorService } from './service/donate.service'
import { DonationDto } from './dto/donation.dto'
import { DonationService } from './service/donation.service'
import { Public } from '../auth/guard/auth.guard'
import { DonationBroadcastSuccessDto } from './dto/brodcast-success.dto'

@Controller('/donation')
export class DonationController {
    constructor(
        private readonly donorService: DonorService,
        private readonly donationService: DonationService,
    ) {}

    @Get('/:publicKey')
    async getDonationInfo(@Param('publicKey') publicKey: string) {
        return this.donationService.getDonationInfo(publicKey)
    }

    @Public()
    @Post('/donate')
    async donate(@Body() donationDto: DonationDto) {
        return await this.donorService.donate(
            donationDto.txSignature,
            donationDto.message,
            donationDto.signature,
        )
    }

    @Get('')
    async getDonation(@Req() req: any) {
        const userId = req.user.id
        return await this.donationService.getDonation(userId)
    }

    @Post('/broadcast/success')
    async donationBrodcastSuccess(
        @Req() req: any,
        @Body() donationBroadcastSuccessDto: DonationBroadcastSuccessDto,
    ) {
        const userId = req.user.id
        return await this.donationService.donationBrodcastSuccess(
            userId,
            donationBroadcastSuccessDto.donationId,
        )
    }
}
