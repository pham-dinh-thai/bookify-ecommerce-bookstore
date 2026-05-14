import { Injectable, Scope } from '@nestjs/common';
import { IRolesCommandRepository } from '../../../domain/role-aggregate/repositories/roles-command.repository.interface';
import { RoleTypeOrm } from '../../entities/role.entity';
import { Role } from '../../../domain/role-aggregate/role.aggregate';
import { RoleNotFoundException } from '../../../domain/role-aggregate/exceptions/role-not-found.exception';
import { RoleMappers } from '../../mappers/roles.mapper';
import { TypeOrmUnitOfWork } from '../../../../../shared/modules/unit-of-work/infrastructure/typeorm-unit-of-work';

@Injectable({ scope: Scope.REQUEST })
export class TypeOrmRolesCommandRepository implements IRolesCommandRepository {
  public constructor(private readonly unitOfWork: TypeOrmUnitOfWork) {}

  public async findOne(id: string): Promise<Role> {
    const roleTypeOrm = await this.unitOfWork
      .getManager()
      .findOne(RoleTypeOrm, {
        where: { id },
        relations: { rolePermissions: true },
      });

    if (!roleTypeOrm) {
      throw new RoleNotFoundException(id);
    }

    return RoleMappers.toDomain(roleTypeOrm);
  }

  public async save(role: Role): Promise<void> {
    await this.unitOfWork
      .getManager()
      .save(RoleTypeOrm, RoleMappers.toTypeOrm(role));
  }

  public async delete(role: Role): Promise<void> {
    await this.unitOfWork
      .getManager()
      .delete(RoleTypeOrm, { id: role.getId() });
  }
}
