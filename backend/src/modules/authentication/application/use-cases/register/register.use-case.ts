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
import { Email } from '../../../../../shared/domain/value-objects/email/email.value-object';
import { EmailHasBeenUseException } from '../../../domain/authenticable-user-aggregate/exceptions/email-has-been-use.exception';

@Injectable()
export class RegisterUseCase {
  public constructor(
    @Inject(AUTHENTICABLE_USER_COMMAND_REPOSITORY)
    private readonly repository: IAuthenticableUserCommandRepository,

    @Inject(AUTHENTICABLE_USER_QUERY_REPOSITORY)
    private readonly queryRepository: IAuthenticableUserQueryRepository,

    @Inject(UUID_GENERATOR)
    private readonly uuid: IUuidGenerator,
  ) {}

  public async execute(request: IRegisterRequest): Promise<void> {
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

    await this.repository.register(authUser);
  }
}
