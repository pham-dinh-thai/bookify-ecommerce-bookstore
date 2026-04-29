import { Injectable } from '@nestjs/common';
import { IPhoneNumberExistsChecker } from '../../domain/customer-aggregate/services/phone-number-exists-checker.service';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomerTypeOrm } from '../entities/customer.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PhoneNumberExistsCheckerService implements IPhoneNumberExistsChecker {
  public constructor(
    @InjectRepository(CustomerTypeOrm)
    private readonly repository: Repository<CustomerTypeOrm>,
  ) {}

  public async exists(phoneNumber: string): Promise<boolean> {
    const customer = await this.repository.findOne({ where: { phoneNumber } });

    return !!customer;
  }
}
