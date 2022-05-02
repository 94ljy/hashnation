import { Body, Controller, Get, Param, Post } from '@nestjs/common'

import { Public } from 'src/auth/guard/auth.guard'
import { DonateDto } from '../dto/donate.dto'
import { DonorService } from '../service/donor.service'

@Public()
@Controller('donor')
export class DonorController {
    constructor(private readonly donorService: DonorService) {}

    @Get('/creator/:username/info')
    async getDonationInfo(@Param('username') username: string) {
        return this.donorService.getCreatorInfo(username)
    }

    @Post('/donate')
    async donate(@Body() donateDto: DonateDto) {
        return this.donorService.donate(
            donateDto.toUsername,
            donateDto.rawTransaction,
            donateDto.message,
        )
    }
}
