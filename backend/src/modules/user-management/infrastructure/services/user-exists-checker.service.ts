import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserTypeOrm } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { IUserExistsChecker } from '../../domain/user-aggregate/services/user-exists-checker.service';

@Injectable()
export class UserExistsChecker implements IUserExistsChecker {
  public constructor(
    @InjectRepository(UserTypeOrm)
    private readonly repository: Repository<UserTypeOrm>,
  ) {}

  public async isExists(id: string): Promise<boolean> {
    const user = await this.repository.findOne({ where: { id } });

    return !!user;
  }
}
