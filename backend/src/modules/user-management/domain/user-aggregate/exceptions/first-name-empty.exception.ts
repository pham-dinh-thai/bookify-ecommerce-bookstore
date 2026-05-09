import { BadRequestDomainException } from '../../../../../shared/domain/exception/domain.exception';

export class FirstNameEmptyException extends BadRequestDomainException {
  public constructor() {
    super('First name is required,', 'FIRST_NAME_EMPTY');
  }
}
