import { OrderStatus } from '../enums/order-status.enum';
import { PaymentStatus } from '../enums/payment-status.enum';
import { OrderItemPreviewReadModel } from './order-item-preview.read-model';

export class MyOrderReadModel {
  public constructor(
    public readonly id: string,
    public readonly status: OrderStatus,
    public readonly paymentStatus: PaymentStatus,
    public readonly totalItems: number,
    public readonly previewItems: OrderItemPreviewReadModel[],
    public readonly createdAt: Date,
  ) {}
}
