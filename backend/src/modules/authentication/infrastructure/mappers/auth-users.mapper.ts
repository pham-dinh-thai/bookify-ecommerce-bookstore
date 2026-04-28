import { UserTypeOrm } from '../../../user-management/infrastructure/entities/user.entity';
import { AuthenticableUser } from '../../domain/authenticable-user-aggregate/authenticable-user.aggregate';

export class AuthUsersMapper {
  public static toTypeOrm(authUser: AuthenticableUser): UserTypeOrm {
    const userTypeOrm = new UserTypeOrm();

    userTypeOrm.id = authUser.getId();
    userTypeOrm.firstName = authUser.getFirstName();
    userTypeOrm.lastName = authUser.getLastName();
    userTypeOrm.email = authUser.getEmail();
    userTypeOrm.gender = authUser.getGender();
    userTypeOrm.password = authUser.getPassword();
    userTypeOrm.roleId = authUser.getRoleId();
    userTypeOrm.isActive = authUser.getIsActive();

    return userTypeOrm;
  }
}
