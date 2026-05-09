import { BadRequestDomainException } from '../../exception/domain.exception';

export class EmailInvalidException extends BadRequestDomainException {
  constructor(email: string) {
    super(
      `Email ${email} invalid! (valid format: example@example.com)`,
      'EMAIL_INVALID',
    );
  }
}
