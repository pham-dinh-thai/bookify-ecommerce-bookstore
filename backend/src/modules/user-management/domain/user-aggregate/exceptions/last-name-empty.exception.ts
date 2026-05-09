import { BadRequestDomainException } from '../../../../../shared/domain/exception/domain.exception';

export class LastNameEmptyException extends BadRequestDomainException {
  public constructor() {
    super('Last name is required,', 'LAST_NAME_EMPTY');
  }
}
