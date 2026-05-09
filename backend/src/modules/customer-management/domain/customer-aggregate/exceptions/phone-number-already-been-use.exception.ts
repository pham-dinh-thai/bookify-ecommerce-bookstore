import { ConflictDomainException } from '../../../../../shared/domain/exception/domain.exception';

export class PhoneNumberAlreadyBeenUseException extends ConflictDomainException {
  public constructor() {
    super('Phone number already been use', 'PHONE_NUMBER_ALREADY_BEEN_USE');
  }
}
