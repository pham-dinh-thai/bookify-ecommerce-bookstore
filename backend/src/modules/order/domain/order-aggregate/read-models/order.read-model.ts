import { OrderStatus } from '../enums/order-status.enum';
import { PaymentMethod } from '../enums/payment-method.enum';
import { PaymentStatus } from '../enums/payment-status.enum';

export class OrderReadModel {
  public constructor(
    public readonly id: string,
    public readonly orderCode: string,
    public readonly status: OrderStatus,
    public readonly paymentStatus: PaymentStatus,
    public readonly paymentMethod: PaymentMethod,
    public readonly totalAmount: number,
    public readonly totalItems: number,
    public readonly createdAt: Date,
  ) {}
}
