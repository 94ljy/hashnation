import { Donation } from '../domain/donation.entity'

export class DonationCreatedEvent {
    public donation: Donation
    public static from(donation: Donation): DonationCreatedEvent {
        const event = new DonationCreatedEvent()
        event.donation = donation
        return event
    }
}
