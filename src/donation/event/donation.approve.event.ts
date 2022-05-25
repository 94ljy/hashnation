import { Donation } from '../domain/donation.entity'

export class DonationApprovedEvent {
    public donation: Donation
    public static from(donation: Donation): DonationApprovedEvent {
        const event = new DonationApprovedEvent()
        event.donation = donation
        return event
    }
}
