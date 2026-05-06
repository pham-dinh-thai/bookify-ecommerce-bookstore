import { Inject, Injectable } from '@nestjs/common';
import {
  CUSTOMERS_QUERY_REPOSITORY,
  type ICustomersQueryRepository,
} from '../../../domain/customer-aggregate/repositories/customers-query.repository.interface';

@Injectable()
export class FindTotalCustomerUseCase {
  public constructor(
    @Inject(CUSTOMERS_QUERY_REPOSITORY)
    private readonly repository: ICustomersQueryRepository,
  ) {}

  public async execute(): Promise<number> {
    const total = await this.repository.count();

    return total;
  }
}
