import { UnprocessableEntityDomainException } from '../../../../../shared/domain/exception/domain.exception';

export class InsufficientStockException extends UnprocessableEntityDomainException {
  public constructor(productId: string, requested: number, available: number) {
    super(
      `Insufficient stock for product ${productId}. Requested: ${requested}, Available: ${available}`,
    );
  }
}
