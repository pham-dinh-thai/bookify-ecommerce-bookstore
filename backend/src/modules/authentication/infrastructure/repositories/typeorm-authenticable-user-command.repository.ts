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
    const userTypeOrm = await this.unitOfWork
      .getManager()
      .findOne(UserTypeOrm, {
        where: { email },
      });

    if (!userTypeOrm) {
      throw new UserNotFoundException();
    }

    return AuthenticableUser.fromPersistent(
      userTypeOrm.id,
      userTypeOrm.firstName,
      userTypeOrm.lastName,
      userTypeOrm.email,
      userTypeOrm.gender as Gender,
      userTypeOrm.password,
      userTypeOrm.isActive,
      userTypeOrm.provider,
      userTypeOrm.providerId,
    );
  }

  public async verifyAndActivateUser(
    authUser: AuthenticableUser,
  ): Promise<void> {
    const userTypeOrm = await this.unitOfWork
      .getManager()
      .findOne(UserTypeOrm, {
        where: { id: authUser.getId() },
      });

    if (!userTypeOrm) {
      throw new UserNotFoundException();
    }

    userTypeOrm.emailVerifiedAt = new Date();
    userTypeOrm.isActive = true;

    await this.unitOfWork.getManager().save(UserTypeOrm, userTypeOrm);
  }

  public async findByProvider(
    provider: string,
    providerId: string,
  ): Promise<AuthenticableUser | null> {
    const userTypeOrm = await this.unitOfWork
      .getManager()
      .findOne(UserTypeOrm, {
        where: { provider, providerId },
      });

    if (!userTypeOrm) {
      return null;
    }

    return AuthenticableUser.fromPersistent(
      userTypeOrm.id,
      userTypeOrm.firstName,
      userTypeOrm.lastName,
      userTypeOrm.email,
      userTypeOrm.gender as Gender,
      userTypeOrm.password,
      userTypeOrm.isActive,
      userTypeOrm.provider,
      userTypeOrm.providerId,
    );
  }

  public async linkProvider(
    userId: string,
    provider: string,
    providerId: string,
  ): Promise<void> {
    await this.unitOfWork
      .getManager()
      .update(UserTypeOrm, { id: userId }, { provider, providerId });
  }
}
