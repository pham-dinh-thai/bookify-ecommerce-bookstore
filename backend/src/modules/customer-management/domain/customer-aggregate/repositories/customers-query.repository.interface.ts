import { CustomerFilter } from '../customer.filter';
import { CustomerDetailReadModel } from '../read-models/customer-detail.read-model';
import { CustomerReadModel } from '../read-models/customer.read-model';

export interface ICustomersQueryRepository {
  findAll(
    page: number,
    limit: number,
    filter?: CustomerFilter,
    search?: string,
  ): Promise<CustomerDetailReadModel[]>;

  findByUserId(userId: string): Promise<CustomerReadModel | null>;

  findIdByEmail(email: string): Promise<string | null>;

  count(filter?: CustomerFilter, search?: string): Promise<number>;
}

export const CUSTOMERS_QUERY_REPOSITORY = 'ICustomersQueryRepository';
