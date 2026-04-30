import { DomainException } from '../../../../../shared/domain/exception/domain.exception';

export class InvalidNameLengthException extends DomainException {
  public constructor() {
    super('Invalid name length (min: 2, max: 100)', 'INVALID_NAME_LENGTH');
  }
}
