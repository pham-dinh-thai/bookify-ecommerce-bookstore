import { OrderStatus } from '../enums/order-status.enum';
import { PaymentMethod } from '../enums/payment-method.enum';
import { PaymentStatus } from '../enums/payment-status.enum';
import { OrderDetailItemReadModel } from './order-detail-item.read-model';

export class OrderDetailReadModel {
  public constructor(
    public readonly id: string,
    public readonly orderCode: string,
    public readonly userId: string,
    public readonly status: OrderStatus,
    public readonly paymentStatus: PaymentStatus,
    public readonly paymentMethod: PaymentMethod,
    public readonly shippingAddress: string,
    public readonly phoneNumber: string,
    public readonly totalItems: number,
    public readonly totalAmount: number,
    public readonly items: OrderDetailItemReadModel[],
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
