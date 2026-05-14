import { Inject, Injectable } from '@nestjs/common';
import {
  type IUsersCommandRepository,
  USERS_COMMAND_REPOSITORY,
} from '../../../domain/user-aggregate/repositories/users-command.repository.interface';
import { ICreateUserRequest } from './create-user.request';
import {
  type IUnitOfWork,
  UNIT_OF_WORK,
} from '../../../../../shared/modules/unit-of-work/application/unit-of-work';
import { User } from '../../../domain/user-aggregate/user.aggregate';
import {
  type IUuidGenerator,
  UUID_GENERATOR,
} from '../../../../../shared/modules/uuid/domain/uuid-generator.interface';
import {
  AUDIT_LOG_COMMAND_REPOSITORY,
  type IAuditLogCommandRepository,
} from '../../../../audit-log/domain/audit-log-aggregate/repositories/audit-log-command.repository.interface';
import {
  type IRolesCommandRepository,
  ROLES_COMMAND_REPOSITORY,
} from '../../../../authorization/domain/role-aggregate/repositories/roles-command.repository.interface';
import {
  EMAIL_EXISTS_CHECKER,
  type IEmailExistsChecker,
} from '../../../domain/user-aggregate/services/email-exists-checker.service';
import { EmailHasBeenUseException } from '../../../domain/user-aggregate/exceptions/email-has-been-use.exception';
import {
  CACHE_REPOSITORY,
  type ICacheRepository,
} from '../../../../../shared/modules/cache/domain/cache.repository.interface';

@Injectable()
export class CreateUserUseCase {
  public constructor(
    @Inject(USERS_COMMAND_REPOSITORY)
    private readonly repository: IUsersCommandRepository,

    @Inject(UNIT_OF_WORK)
    private readonly unitOfWork: IUnitOfWork,

    @Inject(UUID_GENERATOR)
    private readonly uuid: IUuidGenerator,

    @Inject(AUDIT_LOG_COMMAND_REPOSITORY)
    private readonly auditLogRepository: IAuditLogCommandRepository,

    @Inject(ROLES_COMMAND_REPOSITORY)
    private readonly roleRepository: IRolesCommandRepository,

    @Inject(EMAIL_EXISTS_CHECKER)
    private readonly emailExistsChecker: IEmailExistsChecker,

    @Inject(CACHE_REPOSITORY)
    private readonly cache: ICacheRepository,
  ) {}

  public async execute(
    request: ICreateUserRequest,
    performedBy: string,
  ): Promise<void> {
    const isEmailBeenUsed = await this.emailExistsChecker.isExists(
      request.email,
    );
    if (isEmailBeenUsed) {
      throw new EmailHasBeenUseException();
    }

    const role = await this.roleRepository.findOne(request.roleId);
    const id = this.uuid.generate();

    const user = await User.create(
      id,
      request.firstName,
      request.lastName,
      request.email,
      request.gender,
      request.password,
      role.getId(),
    );

    await this.unitOfWork.execute(async () => {
      await this.repository.save(user);

      await this.auditLogRepository.write(
        'CREATE_USER',
        performedBy,
        'user-management',
        'users',
        {
          id: user.getId(),
          firstName: user.getFirstName(),
          lastName: user.getLastName(),
          email: user.getEmail(),
          gender: user.getGender(),
          roleId: user.getRoleId(),
        },
      );

      user.clearDomainEvents();
    });

    await this.cache.delByPattern('users:*');
    await this.cache.delByPattern('customers:*');
  }
}
