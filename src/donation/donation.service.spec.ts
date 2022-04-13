import { Test, TestingModule } from '@nestjs/testing'
import { DonorService } from './service/donor.service'

describe('DonationService', () => {
    let service: DonorService

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [DonorService],
        }).compile()

        service = module.get<DonorService>(DonorService)
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })
})
