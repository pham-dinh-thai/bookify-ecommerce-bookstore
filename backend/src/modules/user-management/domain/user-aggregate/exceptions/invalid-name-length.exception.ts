import { BadRequestDomainException } from '../../../../../shared/domain/exception/domain.exception';

export class InvalidNameLengthException extends BadRequestDomainException {
  public constructor() {
    super('Invalid name length (min: 2, max: 100)', 'INVALID_NAME_LENGTH');
  }
}
