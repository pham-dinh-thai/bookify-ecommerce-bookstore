import { BadRequestDomainException } from '../../../../../../shared/domain/exception/domain.exception';

export class AddressIdEmptyException extends BadRequestDomainException {
  public constructor() {
    super('AddressId should not be empty', 'ADDRESS_ID_EMPTY');
  }
}
