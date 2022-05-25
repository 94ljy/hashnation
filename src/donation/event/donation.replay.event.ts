import { Donation } from '../domain/donation.entity'

export class DonationReplayEvent {
    public donation: Donation
    public static from(donation: Donation): DonationReplayEvent {
        const event = new DonationReplayEvent()
        event.donation = donation
        return event
    }
}
