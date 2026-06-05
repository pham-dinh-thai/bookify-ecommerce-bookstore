import { Injectable, Scope } from '@nestjs/common';
import { TypeOrmUnitOfWork } from '../../../../shared/modules/unit-of-work/infrastructure/typeorm-unit-of-work';
import { UserTypeOrm } from '../../../user-management/infrastructure/entities/user.entity';
import { AuthenticableUser } from '../../domain/authenticable-user-aggregate/authenticable-user.aggregate';
import { IAuthenticableUserCommandRepository } from '../../domain/authenticable-user-aggregate/repositories/authenticable-user-command.repository.interface';
import { AuthUsersMapper } from '../mappers/auth-users.mapper';
import { Gender } from '../../../../shared/domain/enums/gender.enum';
import { UserNotFoundException } from '../../../user-management/domain/user-aggregate/exceptions/user-not-found.exception';

@Injectable({ scope: Scope.REQUEST })
export class TypeOrmAuthenticableUserCommandRepository implements IAuthenticableUserCommandRepository {
  constructor(private readonly unitOfWork: TypeOrmUnitOfWork) {}

  public async register(authUser: AuthenticableUser): Promise<void> {
    await this.unitOfWork
      .getManager()
      .save(UserTypeOrm, AuthUsersMapper.toTypeOrm(authUser));
  }

  public async findByEmail(email: string): Promise<AuthenticableUser> {
    const user = await this.unitOfWork.getManager().findOne(UserTypeOrm, {
      where: { email },
    });

    if (!user) {
      throw new UserNotFoundException();
    }

    return AuthenticableUser.fromPersistent(
      user.id,
      user.firstName,
      user.lastName,
      user.email,
      user.gender as Gender,
      user.password,
      user.isActive,
    );
  }

  public async activateUser(userId: string): Promise<void> {
    const user = await this.unitOfWork.getManager().findOne(UserTypeOrm, {
      where: { id: userId },
    });

    if (!user) {
      throw new UserNotFoundException();
    }

    user.isActive = true;

    await this.unitOfWork.getManager().save(UserTypeOrm, user);
  }
}
