import { Inject, Injectable, Scope } from '@nestjs/common';
import { IUsersCommandRepository } from '../../../domain/user-aggregate/repositories/users-command.repository.interface';
import { TypeOrmUnitOfWork } from '../../../../../shared/modules/unit-of-work/infrastructure/typeorm-unit-of-work';
import { User } from '../../../domain/user-aggregate/user.aggregate';
import { UserTypeOrm } from '../../entities/user.entity';
import { UsersMapper } from '../../mappers/users/users.mapper';

@Injectable({ scope: Scope.REQUEST })
export class TypeOrmUsersCommandRepository implements IUsersCommandRepository {
  public constructor(private readonly unitOfWork: TypeOrmUnitOfWork) {}

  public async findOne(id: string): Promise<User> {
    const userTypeOrm = await this.unitOfWork
      .getManager()
      .findOne(UserTypeOrm, { where: { id } });

    if (!userTypeOrm) {
      throw Error('error');
    }

    return UsersMapper.toDomain(userTypeOrm);
  }

  public async save(user: User): Promise<void> {
    await this.unitOfWork
      .getManager()
      .save(UserTypeOrm, UsersMapper.toTypeOrm(user));
  }

  public async updateGender(userId: string, gender: string): Promise<void> {
    await this.unitOfWork
      .getManager()
      .update(UserTypeOrm, { id: userId }, { gender });
  }

  public async delete(user: User): Promise<void> {
    await this.unitOfWork
      .getManager()
      .delete(UserTypeOrm, { id: user.getId() });
  }
}
