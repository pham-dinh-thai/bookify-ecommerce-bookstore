import { BadRequestDomainException } from '../../exception/domain.exception';

export class PasswordTooLongException extends BadRequestDomainException {
  constructor() {
    super(
      `Password can't be too long! (max: 100 characters)`,
      'PASSWORD_TOO_LONG',
    );
  }
}
