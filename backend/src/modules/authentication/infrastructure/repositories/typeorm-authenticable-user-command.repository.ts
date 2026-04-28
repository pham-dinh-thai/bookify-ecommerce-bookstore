import { Injectable, Scope } from '@nestjs/common';
import { TypeOrmUnitOfWork } from '../../../../shared/unit-of-work/infrastructure/typeorm-unit-of-work';
import { UserTypeOrm } from '../../../user-management/infrastructure/entities/user.entity';
import { AuthenticableUser } from '../../domain/authenticable-user-aggregate/authenticable-user.aggregate';
import { IAuthenticableUserCommandRepository } from '../../domain/authenticable-user-aggregate/repositories/authenticable-user-command.repository.interface';
import { AuthUsersMapper } from '../mappers/auth-users.mapper';

@Injectable({ scope: Scope.REQUEST })
export class TypeOrmAuthenticableUserCommandRepository implements IAuthenticableUserCommandRepository {
  constructor(private readonly unitOfWork: TypeOrmUnitOfWork) {}

  public async register(authUser: AuthenticableUser): Promise<void> {
    await this.unitOfWork
      .getManager()
      .save(UserTypeOrm, AuthUsersMapper.toTypeOrm(authUser));
  }
}
