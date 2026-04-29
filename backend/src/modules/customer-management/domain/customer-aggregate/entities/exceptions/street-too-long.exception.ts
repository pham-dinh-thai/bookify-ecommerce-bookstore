import { DomainException } from '../../../../../../shared/domain/exception/domain.exception';

export class StreetTooLongException extends DomainException {
  public constructor() {
    super('Street should not exceed 255 characters', 'STREET_TOO_LONG', 400);
  }
}
