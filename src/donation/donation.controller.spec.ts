import { Test, TestingModule } from '@nestjs/testing'
import { DonationController } from './donation.controller'
import { DonationService } from './service/donation.service.service'

describe('DonationController', () => {
    let controller: DonationController

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [DonationController],
            providers: [DonationService],
        }).compile()

        controller = module.get<DonationController>(DonationController)
    })

    it('should be defined', () => {
        expect(controller).toBeDefined()
    })
})
