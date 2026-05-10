import { InjectRepository } from '@nestjs/typeorm';
import { IUsersQueryRepository } from '../../../domain/user-aggregate/repositories/users-query.repository.interface';
import { UserTypeOrm } from '../../entities/user.entity';
import { Repository } from 'typeorm';
import { UserReadModel } from '../../../domain/user-aggregate/read-models/user.read-model';
import { Injectable } from '@nestjs/common';
import { UserFilter } from '../../../domain/user-aggregate/user-filter';
import { UsersMapper } from '../../mappers/users/users.mapper';

@Injectable()
export class TypeOrmUsersQueryRepository implements IUsersQueryRepository {
  public constructor(
    @InjectRepository(UserTypeOrm)
    private readonly repository: Repository<UserTypeOrm>,
  ) {}

  public async findAll(
    page: number,
    limit: number,
    filter?: UserFilter,
    search?: string,
  ): Promise<UserReadModel[]> {
    const query = this.repository.createQueryBuilder('user');

    if (filter?.roleId) {
      query.andWhere('user.roleId = :roleId', { roleId: filter.roleId });
    }

    if (filter?.excludeRoleId) {
      query.andWhere('user.roleId != :excludeRoleId', {
        excludeRoleId: filter.excludeRoleId,
      });
    }

    if (filter?.isActive !== undefined) {
      query.andWhere('user.isActive = :isActive', {
        isActive: filter.isActive,
      });
    }

    if (search) {
      query.andWhere(
        '(user.firstName LIKE :search OR user.lastName LIKE :search OR user.email LIKE :search)',
        { search: `%${search}%` },
      );
    }

    const usersTypeOrm = await query
      .orderBy('user.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return usersTypeOrm.map((userTypeOrm) =>
      UsersMapper.toReadModel(userTypeOrm),
    );
  }

  public async findOne(id: string): Promise<UserReadModel | null> {
    const userTypeOrm = await this.repository.findOne({ where: { id } });

    if (!userTypeOrm) {
      return null;
    }

    return UsersMapper.toReadModel(userTypeOrm);
  }

  public async count(filter?: UserFilter, search?: string): Promise<number> {
    const query = this.repository
      .createQueryBuilder('user')
      .select('COUNT(*)', 'count');

    if (filter?.roleId) {
      query.andWhere('user.roleId = :roleId', { roleId: filter.roleId });
    }

    if (filter?.excludeRoleId) {
      query.andWhere('user.roleId != :excludeRoleId', {
        excludeRoleId: filter.excludeRoleId,
      });
    }

    if (filter?.isActive !== undefined) {
      query.andWhere('user.isActive = :isActive', {
        isActive: filter.isActive,
      });
    }

    if (search) {
      query.andWhere(
        '(user.firstName LIKE :search OR user.lastName LIKE :search OR user.email LIKE :search)',
        { search: `%${search}%` },
      );
    }

    const result = await query.getRawOne();

    return parseInt(result.count, 10);
  }

  public async countByRole(roleId: string): Promise<number> {
    const total = await this.repository.countBy({ roleId });

    return total;
  }
}
