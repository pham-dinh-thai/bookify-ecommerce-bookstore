import { CustomerReadModel } from '../read-models/customer.read-model';

export interface ICustomersQueryRepository {
  findAll(): Promise<CustomerReadModel[]>;

  findIdByEmail(email: string): Promise<string | null>;
}

export const CUSTOMERS_QUERY_REPOSITORY = 'ICustomersQueryRepository';
