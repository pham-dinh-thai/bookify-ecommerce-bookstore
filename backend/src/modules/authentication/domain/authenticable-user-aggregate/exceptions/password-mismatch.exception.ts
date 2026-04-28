import { DomainException } from '../../../../../shared/domain/exception/domain.exception';

export class PasswordMismatchException extends DomainException {
  public constructor() {
    super(
      'Password and password confirmation do not match.',
      'PASSWORD_MISMATCH',
    );
  }
}
