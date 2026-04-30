import { Injectable } from '@nestjs/common';
import { IEmailExistsChecker } from '../../domain/user-aggregate/services/email-exists-checker.service';
import { InjectRepository } from '@nestjs/typeorm';
import { UserTypeOrm } from '../entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EmailExistsChecker implements IEmailExistsChecker {
  public constructor(
    @InjectRepository(UserTypeOrm)
    private readonly repository: Repository<UserTypeOrm>,
  ) {}

  public async isExists(email: string): Promise<boolean> {
    const user = await this.repository.findOne({ where: { email } });

    return !!user;
  }
}
