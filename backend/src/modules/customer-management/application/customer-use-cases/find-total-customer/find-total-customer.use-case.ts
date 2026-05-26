import { Inject, Injectable } from '@nestjs/common';
import {
  CUSTOMERS_QUERY_REPOSITORY,
  type ICustomersQueryRepository,
} from '../../../domain/customer-aggregate/repositories/customers-query.repository.interface';

/**
 * Returns the total number of customers in the system.
 *
 * Used for business dashboards that track customer growth and store reach.
 */
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
