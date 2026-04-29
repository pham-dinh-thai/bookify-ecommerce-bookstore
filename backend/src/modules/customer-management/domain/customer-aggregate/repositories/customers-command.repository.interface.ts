import { Customer } from '../customer.aggregate';

export interface ICustomersCommandRepository {
  save(customer: Customer): Promise<void>;
}

export const CUSTOMERS_COMMAND_REPOSITORY = 'ICustomersCommandRepository';
