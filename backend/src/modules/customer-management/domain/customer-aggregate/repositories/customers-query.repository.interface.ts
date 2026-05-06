import { CustomerReadModel } from '../read-models/customer.read-model';

export interface ICustomersQueryRepository {
  findAll(): Promise<CustomerReadModel[]>;

  findIdByEmail(email: string): Promise<string | null>;

  count(): Promise<number>;
}

export const CUSTOMERS_QUERY_REPOSITORY = 'ICustomersQueryRepository';
