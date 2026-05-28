import { BadRequestDomainException } from '../../../../../../shared/domain/exception/domain.exception';

export class ShippingAddressEmptyException extends BadRequestDomainException {
  public constructor() {
    super('Shipping address is required', 'SHIPPING_ADDRESS_EMPTY');
  }
}
