import { Gender } from '../../../../../shared/domain/enums/gender.enum';

export interface ICreateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  gender: Gender;
  password: string;
  roleId: string;
}
