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

export type FromPersistentUserProps = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  password: string;
  isActive: boolean;
  roleId: string;
};

export type UpdateUserProps = {
  firstName: string;
  lastName: string;
  email: string;
  gender: Gender;
  roleId: string;
};
