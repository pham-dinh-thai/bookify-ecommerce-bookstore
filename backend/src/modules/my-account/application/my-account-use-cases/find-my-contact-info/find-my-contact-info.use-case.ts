import { Inject, Injectable } from '@nestjs/common';
import {
  CUSTOMERS_QUERY_REPOSITORY,
  type ICustomersQueryRepository,
} from '../../../../customer-management/domain/customer-aggregate/repositories/customers-query.repository.interface';
import { FindMyContactInfoResponse } from './find-my-contact-info.response';
import { CustomerReadModel } from '../../../../customer-management/domain/customer-aggregate/read-models/customer.read-model';
import { CustomerNotFoundException } from '../../../../customer-management/domain/customer-aggregate/exceptions/customer-not-found.exception';
import { AddressResponse } from './address.response';

@Injectable()
export class FindMyContactInfoUseCase {
  public constructor(
    @Inject(CUSTOMERS_QUERY_REPOSITORY)
    private readonly customersQueryRepository: ICustomersQueryRepository,
  ) {}

  public async execute(userId: string): Promise<FindMyContactInfoResponse> {
    const customer: CustomerReadModel | null =
      await this.customersQueryRepository.findByUserId(userId);

    if (!customer) {
      throw new CustomerNotFoundException(userId);
    }

    const response = new FindMyContactInfoResponse(
      customer?.phoneNumber ?? null,
      customer.addresses.map(
        (address) =>
          new AddressResponse(
            address.id,
            address.street,
            address.provinceName,
            address.wardName,
            address.isDefault,
          ),
      ),
    );

    return response;
  }
}
