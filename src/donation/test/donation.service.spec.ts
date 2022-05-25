import { BadRequestException } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Donation, DonationStatus } from '../domain/donation.entity'
import { DonationService } from '../service/donation.service'
import { DonationRepository } from '../repository/donation.repository'

describe('DonationService', () => {
    let donationService: DonationService
    let eventEmitter: EventEmitter2
    let donationRepository: DonationRepository

    // beforeEach(async () => {
    //     const module: TestingModule = await Test.createTestingModule({
    //         providers: [
    //             {
    //                 provide: EventEmitter2,
    //                 useValue: {},
    //             },
    //             {
    //                 provide: DonationRepository,
    //                 useValue: {},
    //             },
    //             DonationService,
    //         ],
    //     }).compile()

    //     donationService = module.get<DonationService>(DonationService)
    //     eventEmitter = module.get(EventEmitter2)
    //     donationRepository = module.get<DonationRepository>(DonationRepository)
    // })

    // describe('getDonations', () => {
    //     //
    //     const userId = '0000-0000-0000-0000'
    //     const page = 1
    //     const limit = 10

    //     it('user get donations success', async () => {
    //         // donationService.getDonations = jest.fn().mockResolvedValue([[], 0])

    //         donationRepository.findAndCount = jest
    //             .fn()
    //             .mockResolvedValue([[], 0])

    //         const [donations, cnt] = await donationService.getDonations(
    //             userId,
    //             page,
    //             limit,
    //         )

    //         expect(donationRepository.findAndCount).toBeCalledTimes(1)

    //         expect(donations).toHaveLength(0)
    //         expect(cnt).toBe(0)
    //     })
    // })

    // describe('replayDonation', () => {
    //     it('user replay donation success', async () => {
    //         const donation = new Donation()
    //         donation.id = '0000-0000-0000-0000'
    //         donation.status = DonationStatus.APPROVED

    //         donationRepository.findOneByDonationId = jest
    //             .fn()
    //             .mockResolvedValue(donation)

    //         eventEmitter.emit = jest.fn().mockReturnValue(true)

    //         await donationService.replayDonation('', '')

    //         expect(donationRepository.findOneByDonationId).toBeCalledTimes(1)

    //         expect(eventEmitter.emit).toBeCalledTimes(1)

    //         expect(eventEmitter.emit).toBeCalledWith(
    //             WIDGET_DONATE_EVENT,
    //             donation,
    //         )
    //     })

    //     it('donation replay not found', async () => {
    //         donationRepository.findOneByDonationId = jest
    //             .fn()
    //             .mockResolvedValue(undefined)

    //         const rejects = expect(
    //             donationService.replayDonation('', ''),
    //         ).rejects

    //         await rejects.toThrowError(BadRequestException)
    //         await rejects.toThrow('Donation not found')

    //         expect(donationRepository.findOneByDonationId).toBeCalledTimes(1)
    //     })

    //     it('donation replay not approved', async () => {
    //         const donation = new Donation()
    //         donation.id = '0000-0000-0000-0000'
    //         donation.status = DonationStatus.REJECTED

    //         donationRepository.findOneByDonationId = jest
    //             .fn()
    //             .mockResolvedValue(donation)

    //         const rejects = expect(
    //             donationService.replayDonation('', ''),
    //         ).rejects

    //         await rejects.toThrowError(BadRequestException)

    //         await rejects.toThrow('Donation is not approved')

    //         expect(donationRepository.findOneByDonationId).toBeCalledTimes(1)
    //     })
    // })
})
