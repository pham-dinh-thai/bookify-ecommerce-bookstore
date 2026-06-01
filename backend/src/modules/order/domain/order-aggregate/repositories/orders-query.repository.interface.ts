import { OrderStatus } from '../enums/order-status.enum';
import { PaymentStatus } from '../enums/payment-status.enum';
import { MyOrderReadModel } from '../read-models/my-order.read-model';
import { OrderDetailReadModel } from '../read-models/order-detail.read-model';
import { OrderReadModel } from '../read-models/order.read-model';

export interface IOrdersQueryRepository {
  findAll(
    page: number,
    limit: number,
    search?: string,
  ): Promise<OrderReadModel[]>;

  findUserOrders(userId: string): Promise<MyOrderReadModel[]>;

  findOne(id: string): Promise<OrderReadModel | null>;

  findOrderDetailById(orderId: string): Promise<OrderDetailReadModel>;

  findOrderDetail(
    userId: string,
    orderId: string,
  ): Promise<OrderDetailReadModel>;

  count(search?: string): Promise<number>;

  countByStatus(status: OrderStatus): Promise<number>;

  countByPaymentStatus(paymentStatus: PaymentStatus): Promise<number>;
}

export const ORDERS_QUERY_REPOSITORY = 'IOrdersQueryRepository';
