import { UserReadModel } from '../../../domain/user-aggregate/read-models/user.read-model';
import { User } from '../../../domain/user-aggregate/user.aggregate';
import { UserTypeOrm } from '../../entities/user.entity';

export class UsersMapper {
  public static toDomain(userTypeOrm: UserTypeOrm): User {
    return User.fromPersistent({
      id: userTypeOrm.id,
      firstName: userTypeOrm.firstName,
      lastName: userTypeOrm.lastName,
      email: userTypeOrm.email,
      gender: userTypeOrm.gender,
      password: userTypeOrm.password,
      isActive: userTypeOrm.isActive,
      roleId: userTypeOrm.roleId,
    });
  }

  public static toTypeOrm(user: User): UserTypeOrm {
    const userTypeOrm = new UserTypeOrm();

    userTypeOrm.id = user.getId();
    userTypeOrm.firstName = user.getFirstName();
    userTypeOrm.lastName = user.getLastName();
    userTypeOrm.email = user.getEmail();
    userTypeOrm.gender = user.getGender();
    userTypeOrm.password = user.getPassword();
    userTypeOrm.isActive = user.getIsActive();
    userTypeOrm.roleId = user.getRoleId();

    return userTypeOrm;
  }

  public static toReadModel(userTypeOrm: UserTypeOrm): UserReadModel {
    return new UserReadModel(
      userTypeOrm.id,
      userTypeOrm.firstName,
      userTypeOrm.lastName,
      userTypeOrm.email,
      userTypeOrm.gender,
      userTypeOrm.roleId,
      userTypeOrm.isActive,
    );
  }
}
