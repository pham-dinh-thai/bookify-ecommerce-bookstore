import { Inject, Injectable } from '@nestjs/common';
import {
  type IUsersCommandRepository,
  USERS_COMMAND_REPOSITORY,
} from '../../../domain/user-aggregate/repositories/users-command.repository.interface';
import {
  type IUnitOfWork,
  UNIT_OF_WORK,
} from '../../../../../shared/modules/unit-of-work/application/unit-of-work';
import {
  AUDIT_LOG_COMMAND_REPOSITORY,
  type IAuditLogCommandRepository,
} from '../../../../audit-log/domain/audit-log-aggregate/repositories/audit-log-command.repository.interface';
import { UserAlreadyDeactivatedException } from '../../../domain/user-aggregate/exceptions/user-already-deactivated.exception';
import {
  CACHE_REPOSITORY,
  type ICacheRepository,
} from '../../../../../shared/modules/cache/domain/cache.repository.interface';

@Injectable()
export class DeactivateUserUseCase {
  public constructor(
    @Inject(USERS_COMMAND_REPOSITORY)
    private readonly repository: IUsersCommandRepository,

    @Inject(UNIT_OF_WORK)
    private readonly unitOfWork: IUnitOfWork,

    @Inject(AUDIT_LOG_COMMAND_REPOSITORY)
    private readonly auditLogRepository: IAuditLogCommandRepository,

    @Inject(CACHE_REPOSITORY)
    private readonly cache: ICacheRepository,
  ) {}

  public async execute(id: string, performedBy: string): Promise<void> {
    const user = await this.repository.findOne(id);

    if (!user.getIsActive()) {
      throw new UserAlreadyDeactivatedException();
    }

    user.deactivate();

    await this.unitOfWork.execute(async () => {
      await this.repository.save(user);

      await this.auditLogRepository.write(
        'DEACTIVATE_USER',
        performedBy,
        'user-management',
        'users',
        {
          userId: user.getId(),
        },
      );
    });

    await this.cache.delByPattern('users:*');
    await this.cache.delByPattern('customers:*');
  }
}
