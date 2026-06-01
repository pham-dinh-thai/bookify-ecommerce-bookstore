import { OrderStatus } from '../../../../order/domain/order-aggregate/enums/order-status.enum';
import { PaymentStatus } from '../../../../order/domain/order-aggregate/enums/payment-status.enum';

export class RecentOrderReadModel {
  public constructor(
    public readonly id: string,
    public readonly orderCode: string,
    public readonly status: OrderStatus,
    public readonly paymentStatus: PaymentStatus,
    public readonly totalAmount: number,
    public readonly createdAt: Date,
    public readonly detailPath: string,
  ) {}
}
