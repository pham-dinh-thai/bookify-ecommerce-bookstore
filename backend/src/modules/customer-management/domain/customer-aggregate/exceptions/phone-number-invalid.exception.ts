import { DomainException } from '../../../../../shared/domain/exception/domain.exception';

export class PhoneNumberInvalidException extends DomainException {
  public constructor() {
    super('Phone number is invalid', 'PHONE_NUMBER_INVALID', 400);
  }
}
