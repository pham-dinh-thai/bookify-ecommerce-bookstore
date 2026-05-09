import { BadRequestDomainException } from '../../../../../../shared/domain/exception/domain.exception';

export class StreetEmptyException extends BadRequestDomainException {
  public constructor() {
    super('Street should not be empty', 'STREET_EMPTY');
  }
}
