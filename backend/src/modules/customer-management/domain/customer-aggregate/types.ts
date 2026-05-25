import { Gender } from '../../../../shared/domain/enums/gender.enum';
import { FromPersistentAddressProps } from './entities/types';

export type CreateCustomerProps = {
  id: string;
  userId: string;
  gender?: Gender;
  phoneNumber?: string;
};

export type FromPersistentCustomerProps = {
  id: string;
  userId: string;
  gender: Gender;
  phoneNumber?: string | null;
  addresses: FromPersistentAddressProps[];
};

export interface AddAddressProps {
  id: string;
  street: string;
  provinceCode: string;
  provinceName: string;
  wardCode: string;
  wardName: string;
}
