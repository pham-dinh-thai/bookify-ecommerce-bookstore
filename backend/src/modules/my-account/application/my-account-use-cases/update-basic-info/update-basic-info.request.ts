import { Gender } from '../../../../../shared/domain/enums/gender.enum';

export interface IUpdateBasicInfoRequest {
  firstName: string;
  lastName: string;
  gender: Gender;
}
