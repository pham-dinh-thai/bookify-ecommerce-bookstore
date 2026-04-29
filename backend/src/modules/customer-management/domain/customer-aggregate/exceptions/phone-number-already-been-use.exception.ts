import { DomainException } from '../../../../../shared/domain/exception/domain.exception';

export class PhoneNumberAlreadyBeenUseException extends DomainException {
  public constructor() {
    super(
      'Phone number already been use',
      'PHONE_NUMBER_ALREADY_BEEN_USE',
      400,
    );
  }
}
