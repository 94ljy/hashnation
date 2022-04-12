import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { RecipientEntity } from '../entity/recipient.entity'

@Injectable()
export class RecipientService {
    constructor(
        @InjectRepository(RecipientEntity)
        private readonly recipientRepository: Repository<RecipientEntity>,
    ) {}

    async create(address: string, name: string) {
        const recipient = new RecipientEntity()
        recipient.createdAt = new Date()
        recipient.address = address
        recipient.name = name
        await this.recipientRepository.save(recipient)
    }
}
