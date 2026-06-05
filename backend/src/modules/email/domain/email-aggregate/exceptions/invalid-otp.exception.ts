import { BadRequestDomainException } from '../../../../../shared/domain/exception/domain.exception';

export class InvalidOtpException extends BadRequestDomainException {
  public constructor() {
    super('The provided OTP is invalid.', 'INVALID_OTP');
  }
}
