import { Address } from '../address.entity';

export interface IAddressesCommandRepository {
  save(customerId: string, address: Address): Promise<void>;
}

export const ADDRESSES_COMMAND_REPOSITORY = 'IAddressesCommandRepository';
