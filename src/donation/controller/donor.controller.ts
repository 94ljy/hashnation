import { Body, Controller, Get, Param, Post } from '@nestjs/common'

import { Public } from 'src/auth/guard/auth.guard'
import { SolDonateDto } from '../dto/donate.dto'
import { DonorService } from '../service/donor.service'
import { SolDonateService } from '../service/sol.donate.service'

@Public()
@Controller('donor')
export class DonorController {
    constructor(
        private readonly donorService: DonorService,
        private readonly solDonateService: SolDonateService,
    ) {}

    @Get('/creator/:username/info')
    async getDonationInfo(@Param('username') username: string) {
        return this.donorService.getCreatorInfo(username)
    }

    @Post('/donate/sol')
    async donate(@Body() solDonateDto: SolDonateDto) {
        return this.solDonateService.donate(
            solDonateDto.toUsername,
            solDonateDto.rawTransaction,
            solDonateDto.message,
        )
    }
}
