import { Inject, Injectable } from '@nestjs/common';
import { IVerifyEmailRequest } from './verify-email.request';
import {
  CACHE_REPOSITORY,
  type ICacheRepository,
} from '../../../../shared/modules/cache/domain/cache.repository.interface';
import { InvalidOtpException } from '../../domain/email-aggregate/exceptions/invalid-otp.exception';
import {
  AUTHENTICABLE_USER_COMMAND_REPOSITORY,
  type IAuthenticableUserCommandRepository,
} from '../../../authentication/domain/authenticable-user-aggregate/repositories/authenticable-user-command.repository.interface';
import { AuthenticableUser } from '../../../authentication/domain/authenticable-user-aggregate/authenticable-user.aggregate';

@Injectable()
export class VerifyEmailUseCase {
  public constructor(
    @Inject(CACHE_REPOSITORY)
    private readonly cacheRepository: ICacheRepository,

    @Inject(AUTHENTICABLE_USER_COMMAND_REPOSITORY)
    private readonly authenticableUserCommandRepository: IAuthenticableUserCommandRepository,
  ) {}

  public async execute(
    request: IVerifyEmailRequest,
    email: string,
  ): Promise<void> {
    const cachedOtp = await this.cacheRepository.get(
      `email_verification_otp:${email}`,
    );

    if (cachedOtp !== request.otp) {
      throw new InvalidOtpException();
    }

    const authUser: AuthenticableUser =
      await this.authenticableUserCommandRepository.findByEmail(email);

    authUser.activate();

    await this.authenticableUserCommandRepository.verifyAndActivateUser(
      authUser,
    );

    await this.cacheRepository.del(`email_verification_otp:${email}`);
  }
}
