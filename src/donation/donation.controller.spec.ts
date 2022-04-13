import { Test, TestingModule } from '@nestjs/testing'
import { DonationController } from './donation.controller'
import { DonorService } from './service/donor.service'

describe('DonationController', () => {
    let controller: DonationController

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [DonationController],
            providers: [DonorService],
        }).compile()

        controller = module.get<DonationController>(DonationController)
    })

    it('should be defined', () => {
        expect(controller).toBeDefined()
    })
})
