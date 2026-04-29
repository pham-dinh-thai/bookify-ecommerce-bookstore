import { Injectable, Scope } from '@nestjs/common';
import { TypeOrmUnitOfWork } from '../../../../../shared/unit-of-work/infrastructure/typeorm-unit-of-work';
import { UserTypeOrm } from '../../../../user-management/infrastructure/entities/user.entity';
import { IUsersCommandRepository } from '../../../domain/customer-aggregate/repositories/users-command.repository.interface';

@Injectable({ scope: Scope.REQUEST })
export class TypeOrmUsersCommandRepository implements IUsersCommandRepository {
  public constructor(private readonly unitOfWork: TypeOrmUnitOfWork) {}

  public async updateGender(userId: string, gender: string): Promise<void> {
    await this.unitOfWork
      .getManager()
      .update(UserTypeOrm, { id: userId }, { gender });
  }
}
