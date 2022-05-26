import { EventEmitter2 } from '@nestjs/event-emitter'
import { Test, TestingModule } from '@nestjs/testing'
import { DonationService } from '../service/donation.service'
import { DonationRepository } from '../repository/donation.repository'
import { Donation } from '../domain/donation.entity'
import { CURRENCY_TYPE } from '../../common/currency'
import { DonationReplayEvent } from '../event/donation.replay.event'
import exp from 'constants'

describe('DonationService', () => {
    const userId = 'test-user-id'
    let donationService: DonationService
    let eventEmitter: EventEmitter2
    let donationRepository: DonationRepository

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide: EventEmitter2,
                    useValue: {},
                },
                {
                    provide: DonationRepository,
                    useValue: {},
                },
                DonationService,
            ],
        }).compile()

        donationService = module.get<DonationService>(DonationService)
        eventEmitter = module.get(EventEmitter2)
        donationRepository = module.get<DonationRepository>(DonationRepository)

        eventEmitter.emit = jest.fn().mockReturnValue(true)
    })

    it('donation replay fail donation not found', async () => {
        donationRepository.findOne = jest.fn().mockResolvedValue(undefined)

        await expect(
            donationService.replayDonation(userId, 'donationId'),
        ).rejects.toThrow('Donation not found')
    })

    it('donation replay fail donation not approved', async () => {
        const donation = Donation.createPendingDonation(
            CURRENCY_TYPE.SOL,
            'test-hash',
            'testmessage',
            'testaddress',
            'toaddress',
            {} as any,
            10,
        )

        donationRepository.findOne = jest.fn().mockResolvedValue(donation)

        await expect(
            donationService.replayDonation(userId, 'donationId'),
        ).rejects.toThrow('Donation is not approved')
    })

    it('donation replay success', async () => {
        const donation = Donation.createPendingDonation(
            CURRENCY_TYPE.SOL,
            'test-hash',
            'testmessage',
            'testaddress',
            'toaddress',
            {} as any,
            10,
        )
        donation.approve()

        donationRepository.findOne = jest.fn().mockResolvedValue(donation)

        await expect(
            donationService.replayDonation(userId, 'donationId'),
        ).resolves.not.toThrow()

        expect(eventEmitter.emit).toBeCalledWith(
            DonationReplayEvent.name,
            DonationReplayEvent.from(donation),
        )
    })
})
