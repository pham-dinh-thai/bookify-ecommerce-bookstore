import { BadRequestDomainException } from '../../../../../shared/domain/exception/domain.exception';

export class PasswordVerifyFailed extends BadRequestDomainException {
  public constructor() {
    super('Old password verify failed,', 'PASSWORD_VERIFY_FAILED');
  }
}
