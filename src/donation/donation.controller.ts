import {
    ArgumentMetadata,
    BadRequestException,
    Body,
    Controller,
    Get,
    Injectable,
    PipeTransform,
    Post,
    Req,
    UsePipes,
} from '@nestjs/common'
import { DonateService } from './service/donate.service'
import { CreateRecipientDto } from './dto/create-recipient.dto'
import { DonationDto } from './dto/donation.dto'
import nacl from 'tweetnacl'
import base58 from 'bs58'
import { DonationService } from './service/donation.service'

@Controller('/donation')
export class DonationController {
    constructor(
        private readonly donateService: DonateService,
        private readonly donationService: DonationService,
    ) {}

    // @Post('/recipient')
    // async createRecipient(@Body() createRecipientDto: CreateRecipientDto) {
    //     createRecipientDto.signature

    //     if (
    //         !nacl.sign.detached.verify(
    //             new TextEncoder().encode(createRecipientDto.name),
    //             base58.decode(createRecipientDto.signature),
    //             new TextEncoder().encode(createRecipientDto.address),
    //         )
    //     )
    //         throw new BadRequestException('Invalid signature')

    //     await this.recipientService.create(
    //         createRecipientDto.address,
    //         createRecipientDto.name,
    //     )
    // }

    @Post('/donate')
    async donate(@Body() donationDto: DonationDto) {
        return await this.donateService.donate(
            donationDto.txSignature,
            donationDto.message,
            donationDto.signature,
        )
    }

    @Get('')
    async getDonation(@Req() req: any) {
        const userId = req.user.id

        console.log(userId)

        return await this.donationService.getDonation(userId)
    }
}
