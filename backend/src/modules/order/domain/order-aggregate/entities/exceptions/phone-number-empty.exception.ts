import { BadRequestDomainException } from '../../../../../../shared/domain/exception/domain.exception';

export class PhoneNumberEmptyException extends BadRequestDomainException {
  public constructor() {
    super('Phone number is required', 'PHONE_NUMBER_EMPTY');
  }
}
