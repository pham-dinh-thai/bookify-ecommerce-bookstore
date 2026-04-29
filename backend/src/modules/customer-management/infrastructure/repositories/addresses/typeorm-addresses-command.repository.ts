import { Injectable, Scope } from '@nestjs/common';
import { IAddressesCommandRepository } from '../../../domain/customer-aggregate/entities/repositories/addresses-command.repository.interface';
import { TypeOrmUnitOfWork } from '../../../../../shared/unit-of-work/infrastructure/typeorm-unit-of-work';
import { AddressTypeOrm } from '../../entities/address.entity';
import { Address } from '../../../domain/customer-aggregate/entities/address.entity';
import { AddressesMapper } from '../../mappers/addresses.mapper';

@Injectable({ scope: Scope.REQUEST })
export class TypeOrmAddressesCommandRepository implements IAddressesCommandRepository {
  public constructor(private readonly unitOfWork: TypeOrmUnitOfWork) {}

  public async save(address: Address): Promise<void> {
    await this.unitOfWork
      .getManager()
      .save(AddressTypeOrm, AddressesMapper.toTypeOrm(address));
  }
}
