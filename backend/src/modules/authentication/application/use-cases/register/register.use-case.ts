import { Inject, Injectable } from '@nestjs/common';
import { IRegisterRequest } from './register.request';
import {
  AUTHENTICABLE_USER_COMMAND_REPOSITORY,
  type IAuthenticableUserCommandRepository,
} from '../../../domain/authenticable-user-aggregate/repositories/authenticable-user-command.repository.interface';
import { AuthenticableUser } from '../../../domain/authenticable-user-aggregate/authenticable-user.aggregate';
import {
  type IUuidGenerator,
  UUID_GENERATOR,
} from '../../../../../shared/uuid/domain/uuid-generator.interface';
import {
  AUTHENTICABLE_USER_QUERY_REPOSITORY,
  type IAuthenticableUserQueryRepository,
} from '../../../domain/authenticable-user-aggregate/repositories/authenticable-user-query.repository.interface';
import { EmailHasBeenUseException } from '../../../domain/authenticable-user-aggregate/exceptions/email-has-been-use.exception';
import {
  type IUnitOfWork,
  UNIT_OF_WORK,
} from '../../../../../shared/unit-of-work/application/unit-of-work';
import {
  AUDIT_LOG_COMMAND_REPOSITORY,
  type IAuditLogCommandRepository,
} from '../../../../audit-log/domain/audit-log-aggregate/repositories/audit-log-command.repository.interface';
import {
  type ISignTokenService,
  SIGN_TOKEN_SERVICE,
} from '../../../domain/authenticable-user-aggregate/services/sign-token.service';

@Injectable()
export class RegisterUseCase {
  public constructor(
    @Inject(AUTHENTICABLE_USER_COMMAND_REPOSITORY)
    private readonly repository: IAuthenticableUserCommandRepository,

    @Inject(AUTHENTICABLE_USER_QUERY_REPOSITORY)
    private readonly queryRepository: IAuthenticableUserQueryRepository,

    @Inject(UUID_GENERATOR)
    private readonly uuid: IUuidGenerator,

    @Inject(UNIT_OF_WORK)
    private readonly unitOfWork: IUnitOfWork,

    @Inject(AUDIT_LOG_COMMAND_REPOSITORY)
    private readonly auditLogRepository: IAuditLogCommandRepository,

    @Inject(SIGN_TOKEN_SERVICE)
    private readonly signTokenService: ISignTokenService,
  ) {}

  public async execute(
    request: IRegisterRequest,
  ): Promise<{ tempToken: string }> {
    const existingUser = await this.queryRepository.findByEmail(request.email);

    if (existingUser) {
      throw new EmailHasBeenUseException();
    }

    const id = this.uuid.generate();

    const authUser = await AuthenticableUser.register(
      id,
      request.firstName,
      request.lastName,
      request.email,
      request.password,
      request.passwordConfirmation,
    );

    await this.unitOfWork.execute(async () => {
      await this.repository.register(authUser);

      await this.auditLogRepository.write(
        'REGISTER_USER',
        id,
        'authentication',
        'users',
        {
          id: authUser.getId(),
          firstName: authUser.getFirstName(),
          lastName: authUser.getLastName(),
          email: authUser.getEmail(),
        },
      );
    });

    const tempToken = this.signTokenService.sign(
      {
        userId: authUser.getId(),
      },
      process.env.TEMP_TOKEN_SECRET!,
      '30m',
    );

    return { tempToken };
  }
}
