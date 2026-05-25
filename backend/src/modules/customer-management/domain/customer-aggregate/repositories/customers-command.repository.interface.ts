import { Customer } from '../customer.aggregate';

export interface ICustomersCommandRepository {
  findByUserId(userId: string): Promise<Customer | null>;

  insert(customer: Customer): Promise<void>;

  save(customer: Customer): Promise<void>;
}

export const CUSTOMERS_COMMAND_REPOSITORY = 'ICustomersCommandRepository';
