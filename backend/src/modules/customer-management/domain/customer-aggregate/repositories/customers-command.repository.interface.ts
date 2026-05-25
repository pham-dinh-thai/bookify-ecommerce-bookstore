import { Customer } from '../customer.aggregate';
import { Address } from '../entities/address.entity';

export interface ICustomersCommandRepository {
  findByUserId(userId: string): Promise<Customer | null>;

  insert(customer: Customer): Promise<void>;

  addAddress(customerId: string, address: Address): Promise<void>;

  save(customer: Customer): Promise<void>;
}

export const CUSTOMERS_COMMAND_REPOSITORY = 'ICustomersCommandRepository';
