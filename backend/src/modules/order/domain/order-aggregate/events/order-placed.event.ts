import { DomainEvent } from '../../../../../shared/domain/domain-event';
import { PaymentMethod } from '../enums/payment-method.enum';
import { PaymentStatus } from '../enums/payment-status.enum';

export type OrderPlacedItem = {
  productId: string;
  title: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

export class OrderPlaced extends DomainEvent {
  public constructor(
    public readonly orderId: string,
    public readonly orderCode: string,
    public readonly customerEmail: string,
    public readonly customerName: string,
    public readonly paymentMethod: PaymentMethod,
    public readonly paymentStatus: PaymentStatus,
    public readonly shippingAddress: string,
    public readonly phoneNumber: string,
    public readonly totalAmount: number,
    public readonly items: OrderPlacedItem[],
  ) {
    super();
  }
}
