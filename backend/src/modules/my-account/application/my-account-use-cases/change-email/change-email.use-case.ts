import { Inject, Injectable } from '@nestjs/common';
import {
  type IUsersCommandRepository,
  USERS_COMMAND_REPOSITORY,
} from '../../../../user-management/domain/user-aggregate/repositories/users-command.repository.interface';
import { User } from '../../../../user-management/domain/user-aggregate/user.aggregate';
import { IChangeEmailRequest } from './change-email.request';
import {
  AUDIT_LOG_COMMAND_REPOSITORY,
  type IAuditLogCommandRepository,
} from '../../../../audit-log/domain/audit-log-aggregate/repositories/audit-log-command.repository.interface';
import {
  type IUnitOfWork,
  UNIT_OF_WORK,
} from '../../../../../shared/modules/unit-of-work/application/unit-of-work';

@Injectable()
export class ChangeEmailUseCase {
  public constructor(
    @Inject(USERS_COMMAND_REPOSITORY)
    private readonly usersCommandRepository: IUsersCommandRepository,

    @Inject(AUDIT_LOG_COMMAND_REPOSITORY)
    private readonly auditLogCommandRepository: IAuditLogCommandRepository,

    @Inject(UNIT_OF_WORK)
    private readonly unitOfWork: IUnitOfWork,
  ) {}

  public async execute(
    userId: string,
    request: IChangeEmailRequest,
  ): Promise<void> {
    const user: User = await this.usersCommandRepository.findOne(userId);

    user.changeEmail(request.email);

    await this.unitOfWork.execute(async () => {
      await this.usersCommandRepository.save(user);

      await this.auditLogCommandRepository.write(
        'CHANGE_EMAIL',
        userId,
        'my-account',
        'users',
        {
          userId: user.getId(),
        },
      );
    });
  }
}
