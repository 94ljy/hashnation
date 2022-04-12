import {
    ArgumentMetadata,
    BadRequestException,
    Body,
    Controller,
    Injectable,
    PipeTransform,
    Post,
    UsePipes,
} from '@nestjs/common'
import { DonateService } from './service/donate.service'
import { CreateRecipientDto } from './dto/create-recipient.dto'
import { DonationDto } from './dto/donation.dto'
import { RecipientService } from './service/recipient.service'
import nacl from 'tweetnacl'
import base58 from 'bs58'
import { IsString, IsNotEmpty } from 'class-validator'

@Controller('/donation')
export class DonationController {
    constructor(
        private readonly donationService: DonateService,
        private readonly recipientService: RecipientService,
    ) {}

    @Post('/recipient')
    async createRecipient(@Body() createRecipientDto: CreateRecipientDto) {
        createRecipientDto.signature

        if (
            !nacl.sign.detached.verify(
                new TextEncoder().encode(createRecipientDto.name),
                base58.decode(createRecipientDto.signature),
                new TextEncoder().encode(createRecipientDto.address),
            )
        )
            throw new BadRequestException('Invalid signature')

        await this.recipientService.create(
            createRecipientDto.address,
            createRecipientDto.name,
        )
    }

    @Post('/donate')
    async donate(@Body() donationDto: DonationDto) {
        return await this.donationService.donation(
            donationDto.txSignature,
            donationDto.message,
            donationDto.signature,
        )
    }
}
