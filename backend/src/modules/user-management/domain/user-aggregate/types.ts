import { Gender } from '../../../../shared/domain/enums/gender.enum';

export type CreateUserProps = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  gender: Gender;
  password: string;
  roleId: string;
};
