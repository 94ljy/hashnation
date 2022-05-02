import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common'
import { DonationService } from '../service/donation.service'
import { DonateDto } from '../dto/donate.dto'
import { DonorService } from '../service/donor.service'
import { Public } from 'src/auth/guard/auth.guard'
import { User } from '../../common/user.decorator'
import { AuthenticatedUser } from '../../common/authenticated.user'
import {
    GetDonationQueryDto,
    GetDonationQueryResponseDto,
} from '../dto/get-donation-query.dto'

@Controller('donation')
export class DonationController {
    constructor(private readonly donationService: DonationService) {}

    @Get()
    async getDonations(
        @User() user: AuthenticatedUser,
        @Query() getDonationQueryDto: GetDonationQueryDto,
    ): Promise<GetDonationQueryResponseDto> {
        const [donations, totalCount] = await this.donationService.getDonations(
            user.id,
            getDonationQueryDto.page,
            getDonationQueryDto.limit,
        )

        console.log(typeof getDonationQueryDto.limit)

        return {
            page: getDonationQueryDto.page,
            limit: getDonationQueryDto.limit,
            totalPage: Math.ceil(totalCount / getDonationQueryDto.limit),
            donations: donations.map((donation) => ({
                id: donation.id,
                createdAt: donation.createdAt,
                txSignature: donation.txSignature,
                fromAddress: donation.fromAddress,
                toAddress: donation.toAddress,
                message: donation.message,
                lamports: donation.lamports,
                status: donation.status,
            })),
        }
    }

    @Post('/:donationId/replay')
    async replayDonation(
        @User() user: AuthenticatedUser,
        @Param('donationId') donationId: string,
    ) {
        this.donationService.replayDonation(user.id, donationId)
    }

    // @Post('/widget/donate/test')
    // async test(@User() user: AuthenticatedUser) {
    //     this.donationService.testDonation(user.id)
    // }
}
