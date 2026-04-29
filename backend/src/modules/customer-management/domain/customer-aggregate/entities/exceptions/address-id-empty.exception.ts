import { DomainException } from '../../../../../../shared/domain/exception/domain.exception';

export class AddressIdEmptyException extends DomainException {
  public constructor() {
    super('AddressId should not be empty', 'ADDRESS_ID_EMPTY', 400);
  }
}
