import { InjectRepository } from '@nestjs/typeorm';
import { IUsersQueryRepository } from '../../../domain/user-aggregate/repositories/users-query.repository.interface';
import { UserTypeOrm } from '../../entities/user.entity';
import { Repository } from 'typeorm';
import { UserReadModel } from '../../../domain/user-aggregate/read-models/user.read-model';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TypeOrmUsersQueryRepository implements IUsersQueryRepository {
  public constructor(
    @InjectRepository(UserTypeOrm)
    private readonly repository: Repository<UserTypeOrm>,
  ) {}

  public async findAll(): Promise<UserReadModel[]> {
    const users = await this.repository.find({ order: { createdAt: 'DESC' } });

    return users;
  }

  public async findOne(id: string): Promise<UserReadModel | null> {
    const user = await this.repository.findOne({ where: { id } });

    return user;
  }
}
