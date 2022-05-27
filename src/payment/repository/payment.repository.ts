import { EntityRepository, Repository } from 'typeorm'
import { Payment } from '../domain/payment.entity'

@EntityRepository(Payment)
export class PaymentRepository extends Repository<Payment> {}
