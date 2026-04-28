import { Injectable, Scope } from '@nestjs/common';
import { IAuthenticableUserQueryRepository } from '../../domain/authenticable-user-aggregate/repositories/authenticable-user-query.repository.interface';
import { AuthenticableUserReadModel } from '../../domain/authenticable-user-aggregate/read-models/authenticable-user.read-model';
import { TypeOrmUnitOfWork } from '../../../../shared/unit-of-work/infrastructure/typeorm-unit-of-work';
import { UserTypeOrm } from '../../../user-management/infrastructure/entities/user.entity';

@Injectable({ scope: Scope.REQUEST })
export class TypeOrmAuthenticableUserQueryRepository implements IAuthenticableUserQueryRepository {
  public constructor(private readonly unitOfWork: TypeOrmUnitOfWork) {}

  public async findByEmail(
    email: string,
  ): Promise<AuthenticableUserReadModel | null> {
    const authenticableUser = await this.unitOfWork
      .getManager()
      .findOne(UserTypeOrm, { where: { email } });

    if (!authenticableUser) {
      return null;
    }

    return new AuthenticableUserReadModel(
      authenticableUser.id,
      authenticableUser.email,
      authenticableUser.password,
      authenticableUser.roleId,
      authenticableUser.isActive,
    );
  }
}
