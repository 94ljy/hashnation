import { BadRequestException } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Donation, DonationStatus } from '../../entities/donation.entity'
import { WIDGET_DONATE_EVENT } from '../../event/event'
import { DonationService } from './donation.service'

describe('DonationService', () => {
    let donationService: DonationService
    let eventEmitter: EventEmitter2
    let donationRepository: Repository<Donation>

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide: EventEmitter2,
                    useValue: {},
                },
                {
                    provide: getRepositoryToken(Donation),
                    useValue: {},
                },
                DonationService,
            ],
        }).compile()

        donationService = module.get<DonationService>(DonationService)
        eventEmitter = module.get(EventEmitter2)
        donationRepository = module.get<Repository<Donation>>(
            getRepositoryToken(Donation),
        )
    })

    describe('getDonations', () => {
        //
        const userId = '0000-0000-0000-0000'
        const page = 1
        const limit = 10

        it('user get donations success', async () => {
            // donationService.getDonations = jest.fn().mockResolvedValue([[], 0])

            donationRepository.findAndCount = jest
                .fn()
                .mockResolvedValue([[], 0])

            const [donations, cnt] = await donationService.getDonations(
                userId,
                page,
                limit,
            )

            expect(donationRepository.findAndCount).toBeCalledTimes(1)

            expect(donations).toHaveLength(0)
            expect(cnt).toBe(0)
        })
    })

    describe('replayDonation', () => {
        it('user replay donation success', async () => {
            const donation = new Donation()
            donation.id = '0000-0000-0000-0000'
            donation.status = DonationStatus.APPROVED

            donationRepository.findOne = jest.fn().mockResolvedValue(donation)

            eventEmitter.emit = jest.fn().mockReturnValue(true)

            await donationService.replayDonation('', '')

            expect(donationRepository.findOne).toBeCalledTimes(1)

            expect(eventEmitter.emit).toBeCalledTimes(1)

            expect(eventEmitter.emit).toBeCalledWith(
                WIDGET_DONATE_EVENT,
                donation,
            )
        })

        it('donation replay not found', async () => {
            donationRepository.findOne = jest.fn().mockResolvedValue(undefined)

            const rejects = expect(
                donationService.replayDonation('', ''),
            ).rejects

            await rejects.toThrowError(BadRequestException)
            await rejects.toThrow('Donation not found')

            expect(donationRepository.findOne).toBeCalledTimes(1)
        })

        it('donation replay not approved', async () => {
            const donation = new Donation()
            donation.id = '0000-0000-0000-0000'
            donation.status = DonationStatus.REJECTED

            donationRepository.findOne = jest.fn().mockResolvedValue(donation)

            const rejects = expect(
                donationService.replayDonation('', ''),
            ).rejects

            await rejects.toThrowError(BadRequestException)

            await rejects.toThrow('Donation is not approved')

            expect(donationRepository.findOne).toBeCalledTimes(1)
        })
    })
})
