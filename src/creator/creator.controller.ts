import {
    BadRequestException,
    Body,
    Controller,
    Get,
    NotFoundException,
    Param,
    Post,
    Req,
} from '@nestjs/common'
import { AuthenticatedUser } from '../common/authenticated.user'
import { User } from '../common/user.decorator'
import { CreatorService } from './creator.service'
import { AddCreatorWalletDto } from './dto/add-creator-wallet.dto'
import { CreateCreatorDto } from './dto/create-creator.dto'

@Controller('creator')
export class CreatorController {
    constructor(private readonly creatorService: CreatorService) {}

    @Post()
    async createCreator(
        @User() user: AuthenticatedUser,
        @Body() createCreatorDto: CreateCreatorDto,
    ) {
        await this.creatorService.createCreator(
            user.id,
            createCreatorDto.username,
        )

        return {
            message: 'success',
        }
    }

    @Get()
    async getCreator(@User() user: AuthenticatedUser) {
        const creator = await this.creatorService.getCreator('id', user.id)

        return creator
    }

    @Get('/joined')
    async getJoinedCreator(@User() user: AuthenticatedUser) {
        try {
            await this.creatorService.getCreator('id', user.id)

            return {
                isCreator: true,
            }
        } catch (err) {
            if (err instanceof NotFoundException) {
                return {
                    isCreator: false,
                }
            } else throw new BadRequestException()
        }
        // return creator.joinedCreator
    }

    // @Get('info')
    // async getCreatorInfo(@User() user: AuthenticatedUser) {
    //     const creator = await this.creatorService.getCreator('id', user.id)

    //     return {
    //         username: creator.username,
    //         donationUrl: `http://localhost:8080/donate/${creator.usernmae}`,
    //     }

    //     return creator
    // }

    @Post('wallet')
    async addCreatorWallet(
        @User() user: AuthenticatedUser,
        @Body() addCreatorWalletDto: AddCreatorWalletDto,
    ) {
        await this.creatorService.addCreatorWallet(
            user.id,
            addCreatorWalletDto.type,
            addCreatorWalletDto.address,
            addCreatorWalletDto.signature,
        )

        return {
            message: 'success',
        }
    }

    // @Get('publicKey/:publicKey')
    // async getCreatorByPublicKey(@Param('publicKey') publicKey: string) {
    //     const creator = await this.creatorService.getCreator(
    //         'publicKey',
    //         publicKey,
    //     )

    //     return {
    //         username: creator.username,
    //         publicKey: creator.publicKey,
    //     }
    // }
}
