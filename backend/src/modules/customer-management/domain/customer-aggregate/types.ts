import { Gender } from '../../../../shared/domain/enums/gender.enum';

export type CreateCustomerProps = {
  id: string;
  userId: string;
  gender?: Gender;
  phoneNumber: string;
};
