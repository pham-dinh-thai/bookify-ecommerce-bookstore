import { DomainException } from '../../../../../shared/domain/exception/domain.exception';

export class EmailHasBeenUseException extends DomainException {
  public constructor() {
    super('Email has been used by another account.', 'EMAIL_HAS_BEEN_USED');
  }
}
