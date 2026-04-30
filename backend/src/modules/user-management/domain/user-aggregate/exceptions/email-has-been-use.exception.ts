import { DomainException } from '../../../../../shared/domain/exception/domain.exception';

export class EmailHasBeenUseException extends DomainException {
  public constructor() {
    super('This email already been use', 'EMAIL_BEEN_USE');
  }
}
