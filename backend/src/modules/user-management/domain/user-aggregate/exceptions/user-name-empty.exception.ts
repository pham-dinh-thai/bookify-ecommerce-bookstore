import { BadRequestDomainException } from '../../../../../shared/domain/exception/domain.exception';

export class UserNameEmptyException extends BadRequestDomainException {
  public constructor() {
    super('Name is required,', 'NAME_EMPTY');
  }
}
