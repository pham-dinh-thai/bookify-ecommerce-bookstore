import { BadRequestDomainException } from '../../../../../shared/domain/exception/domain.exception';

export class PhoneNumberInvalidException extends BadRequestDomainException {
  public constructor() {
    super('Phone number is invalid', 'PHONE_NUMBER_INVALID');
  }
}
