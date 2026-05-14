import { Inject, Injectable } from '@nestjs/common';
import {
  CUSTOMERS_QUERY_REPOSITORY,
  type ICustomersQueryRepository,
} from '../../../domain/customer-aggregate/repositories/customers-query.repository.interface';
import { CustomerReadModel } from '../../../domain/customer-aggregate/read-models/customer.read-model';
import {
  CACHE_REPOSITORY,
  type ICacheRepository,
} from '../../../../../shared/modules/cache/domain/cache.repository.interface';
import { CustomerFilter } from '../../../domain/customer-aggregate/customer.filter';
import { FindCustomersResponse } from './find-customers.response';
import {
  CUSTOMER_CACHE_KEYS,
  CUSTOMER_CACHE_TTL,
} from '../customer-cache.constants';

@Injectable()
export class FindCustomersUseCase {
  public constructor(
    @Inject(CUSTOMERS_QUERY_REPOSITORY)
    private readonly repository: ICustomersQueryRepository,

    @Inject(CACHE_REPOSITORY)
    private readonly cache: ICacheRepository,
  ) {}

  public async execute(
    page: number,
    limit: number,
    filter?: CustomerFilter,
    search?: string,
  ): Promise<FindCustomersResponse> {
    const cacheKey = CUSTOMER_CACHE_KEYS.PAGE(page, limit, filter, search);

    const cached = await this.cache.get<FindCustomersResponse>(cacheKey);
    if (cached) {
      return cached;
    }

    const customers = await this.repository.findAll(
      page,
      limit,
      filter,
      search,
    );
    const total = await this.repository.count(filter, search);

    const response = new FindCustomersResponse(customers, total);

    await this.cache.set(cacheKey, response, CUSTOMER_CACHE_TTL.ALL);

    return response;
  }
}
