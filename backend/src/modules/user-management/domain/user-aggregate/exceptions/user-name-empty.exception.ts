import { DomainException } from '../../../../../shared/domain/exception/domain.exception';

export class UserNameEmptyException extends DomainException {
  public constructor() {
    super('Name is required,', 'NAME_EMPTY');
  }
}
