import { Inject, Injectable } from '@nestjs/common';
import {
  type IUsersCommandRepository,
  USERS_COMMAND_REPOSITORY,
} from '../../../../user-management/domain/user-aggregate/repositories/users-command.repository.interface';
import {
  AUDIT_LOG_COMMAND_REPOSITORY,
  type IAuditLogCommandRepository,
} from '../../../../audit-log/domain/audit-log-aggregate/repositories/audit-log-command.repository.interface';
import {
  CACHE_REPOSITORY,
  type ICacheRepository,
} from '../../../../../shared/modules/cache/domain/cache.repository.interface';
import {
  type IUnitOfWork,
  UNIT_OF_WORK,
} from '../../../../../shared/modules/unit-of-work/application/unit-of-work';
import { IUpdateBasicInfoRequest } from './update-basic-info.request';
import { User } from '../../../../user-management/domain/user-aggregate/user.aggregate';

@Injectable()
export class UpdateBasicInfoUseCase {
  public constructor(
    @Inject(USERS_COMMAND_REPOSITORY)
    private readonly usersCommandRepository: IUsersCommandRepository,

    @Inject(AUDIT_LOG_COMMAND_REPOSITORY)
    private readonly auditLogCommandRepository: IAuditLogCommandRepository,

    @Inject(CACHE_REPOSITORY)
    private readonly cacheRepository: ICacheRepository,

    @Inject(UNIT_OF_WORK)
    private readonly unitOfWork: IUnitOfWork,
  ) {}

  public async execute(
    request: IUpdateBasicInfoRequest,
    userId: string,
  ): Promise<void> {
    const user: User = await this.usersCommandRepository.findOne(userId);

    user.updateBasicInfo({
      firstName: request.firstName,
      lastName: request.lastName,
      gender: request.gender,
    });

    await this.unitOfWork.execute(async () => {
      await this.usersCommandRepository.save(user);

      await this.auditLogCommandRepository.write(
        'UPDATE_BASIC_INFO',
        userId,
        'my-account',
        'users',
        {
          userId: user.getId(),
        },
      );
    });

    await this.cacheRepository.delByPattern('users:*');
    await this.cacheRepository.delByPattern('customers:*');
  }
}
