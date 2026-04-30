import { Gender } from '../../../../../shared/domain/enums/gender.enum';

export interface IUpdateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  gender: Gender;
  roleId: string;
}
