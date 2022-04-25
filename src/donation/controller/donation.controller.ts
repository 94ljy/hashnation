import { Body, Controller, Get, Post, Query } from '@nestjs/common'
import { DonationService } from '../service/donation.service'
import { DonateDto } from '../dto/donate.dto'
import { DonorService } from '../service/donor.service'
import { Public } from 'src/auth/guard/auth.guard'
import { User } from '../../common/user.decorator'
import { AuthenticatedUser } from '../../common/authenticated.user'
import { GetDonationQueryDto } from '../dto/get-donation-query.dto'

@Controller('donation')
export class DonationController {
    constructor(
        private readonly donationService: DonationService,
        private readonly donorService: DonorService,
    ) {}

    @Get()
    async getDonations(
        @User() user: AuthenticatedUser,
        @Query() getDonationQueryDto: GetDonationQueryDto,
    ) {
        return this.donationService.getDonations(
            user.id,
            getDonationQueryDto.page,
            getDonationQueryDto.limit,
        )
    }
}
