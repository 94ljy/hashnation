import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common'
import { DonorService } from './service/donor.service'
import { DonationDto } from './dto/donation.dto'
import { DonationService } from './service/donation.service'
import { Public } from '../auth/guard/auth.guard'
import { DonationBroadcastSuccessDto } from './dto/brodcast-success.dto'
import { DonateDto } from './dto/donate.dto'

@Controller('/donation')
export class DonationController {
    constructor(
        private readonly donorService: DonorService,
        private readonly donationService: DonationService,
    ) {}

    @Public()
    @Post('/donate')
    async donate(@Body() donateDto: DonateDto) {
        return await this.donorService.donate(
            donateDto.rawTransaction,
            donateDto.message,
        )
    }

    @Public()
    @Get('/creator/:publicKey')
    async getDonationInfo(@Param('publicKey') publicKey: string) {
        return this.donorService.getCreatorInfoByPublicKey(publicKey)
    }

    @Get('')
    async getD(@Req() req: any) {
        const userId = req.user.id
        return await this.donationService.getD(userId)
    }

    // @Get('')
    // async getDonation(@Req() req: any) {
    //     const userId = req.user.id
    //     return await this.donationService.getDonation(userId)
    // }

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
