import { Inject, Injectable } from '@nestjs/common';
import {
  type IUsersCommandRepository,
  USERS_COMMAND_REPOSITORY,
} from '../../../../user-management/domain/user-aggregate/repositories/users-command.repository.interface';
import { User } from '../../../../user-management/domain/user-aggregate/user.aggregate';
import { IChangePasswordRequest } from './change-password.request';
import {
  type IUnitOfWork,
  UNIT_OF_WORK,
} from '../../../../../shared/modules/unit-of-work/application/unit-of-work';
import {
  AUDIT_LOG_COMMAND_REPOSITORY,
  type IAuditLogCommandRepository,
} from '../../../../audit-log/domain/audit-log-aggregate/repositories/audit-log-command.repository.interface';
import {
  CACHE_REPOSITORY,
  type ICacheRepository,
} from '../../../../../shared/modules/cache/domain/cache.repository.interface';

@Injectable()
export class ChangePasswordUseCase {
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
    request: IChangePasswordRequest,
    userId: string,
  ): Promise<void> {
    const user: User = await this.usersCommandRepository.findOne(userId);

    await user.changePassword(
      request.oldPassword,
      request.newPassword,
      request.newPasswordConfirmation,
    );

    await this.unitOfWork.execute(async () => {
      await this.usersCommandRepository.save(user);

      await this.auditLogCommandRepository.write(
        'CHANGE_PASSWORD',
        userId,
        'my-account',
        'users',
        { userId },
      );
    });
  }
}
