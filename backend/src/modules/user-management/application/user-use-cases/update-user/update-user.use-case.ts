import { Inject, Injectable } from '@nestjs/common';
import { IUpdateUserRequest } from './update-user.request';
import {
  type IUserExistsChecker,
  USER_EXISTS_CHECKER,
} from '../../../domain/user-aggregate/services/user-exists-checker.service';
import { UserNotFoundException } from '../../../domain/user-aggregate/exceptions/user-not-found.exception';
import {
  EMAIL_EXISTS_CHECKER,
  type IEmailExistsChecker,
} from '../../../domain/user-aggregate/services/email-exists-checker.service';
import { EmailHasBeenUseException } from '../../../domain/user-aggregate/exceptions/email-has-been-use.exception';
import {
  type IUsersCommandRepository,
  USERS_COMMAND_REPOSITORY,
} from '../../../domain/user-aggregate/repositories/users-command.repository.interface';
import {
  AUDIT_LOG_COMMAND_REPOSITORY,
  type IAuditLogCommandRepository,
} from '../../../../audit-log/domain/audit-log-aggregate/repositories/audit-log-command.repository.interface';
import {
  type IUnitOfWork,
  UNIT_OF_WORK,
} from '../../../../../shared/modules/unit-of-work/application/unit-of-work';
import {
  CACHE_REPOSITORY,
  type ICacheRepository,
} from '../../../../../shared/modules/cache/domain/cache.repository.interface';

@Injectable()
export class UpdateUserUseCase {
  public constructor(
    @Inject(USER_EXISTS_CHECKER)
    private readonly userExistsChecker: IUserExistsChecker,

    @Inject(EMAIL_EXISTS_CHECKER)
    private readonly emailExistsChecker: IEmailExistsChecker,

    @Inject(USERS_COMMAND_REPOSITORY)
    private readonly repository: IUsersCommandRepository,

    @Inject(AUDIT_LOG_COMMAND_REPOSITORY)
    private readonly auditLogRepository: IAuditLogCommandRepository,

    @Inject(UNIT_OF_WORK)
    private readonly unitOfWork: IUnitOfWork,

    @Inject(CACHE_REPOSITORY)
    private readonly cache: ICacheRepository,
  ) {}

  public async execute(
    id: string,
    request: IUpdateUserRequest,
    performedBy: string,
  ): Promise<void> {
    const isExists = await this.userExistsChecker.isExists(id);
    if (!isExists) {
      throw new UserNotFoundException();
    }

    const user = await this.repository.findOne(id);

    const isEmailBeenUse = await this.emailExistsChecker.isExists(
      request.email,
    );
    if (user.getEmail() !== request.email && isEmailBeenUse) {
      throw new EmailHasBeenUseException();
    }

    user.update({
      firstName: request.firstName,
      lastName: request.lastName,
      email: request.email,
      gender: request.gender,
      roleId: request.roleId,
    });

    await this.unitOfWork.execute(async () => {
      await this.repository.save(user);

      await this.auditLogRepository.write(
        'UPDATE_USER_INFO',
        performedBy,
        'user-management',
        'users',
        {
          user,
        },
      );
    });

    await this.cache.delByPattern('users:*');
    await this.cache.delByPattern('customers:*');
  }
}
