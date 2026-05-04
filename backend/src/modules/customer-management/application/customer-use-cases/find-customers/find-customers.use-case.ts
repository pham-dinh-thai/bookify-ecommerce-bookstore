import { Inject, Injectable } from '@nestjs/common';
import {
  CUSTOMERS_QUERY_REPOSITORY,
  type ICustomersQueryRepository,
} from '../../../domain/customer-aggregate/repositories/customers-query.repository.interface';
import { CustomerReadModel } from '../../../domain/customer-aggregate/read-models/customer.read-model';
import {
  CACHE_REPOSITORY,
  type ICacheRepository,
} from '../../../../../shared/cache/domain/cache.repository.interface';

@Injectable()
export class FindCustomersUseCase {
  public constructor(
    @Inject(CUSTOMERS_QUERY_REPOSITORY)
    private readonly repository: ICustomersQueryRepository,

    @Inject(CACHE_REPOSITORY)
    private readonly cache: ICacheRepository,
  ) {}

  public async execute(): Promise<CustomerReadModel[]> {
    const cacheKey = 'customers';

    const cached = await this.cache.get<CustomerReadModel[]>(cacheKey);
    if (cached) {
      return cached;
    }

    const customers = await this.repository.findAll();
    await this.cache.set(cacheKey, customers);

    return customers;
  }
}
