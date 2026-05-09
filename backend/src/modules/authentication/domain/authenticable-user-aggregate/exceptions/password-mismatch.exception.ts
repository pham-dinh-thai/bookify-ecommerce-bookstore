import { BadRequestDomainException } from '../../../../../shared/domain/exception/domain.exception';

export class PasswordMismatchException extends BadRequestDomainException {
  public constructor() {
    super(
      'Password and password confirmation do not match.',
      'PASSWORD_MISMATCH',
    );
  }
}
