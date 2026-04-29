import { DomainException } from '../../../../../../shared/domain/exception/domain.exception';

export class StreetEmptyException extends DomainException {
  public constructor() {
    super('Street should not be empty', 'STREET_EMPTY', 400);
  }
}
