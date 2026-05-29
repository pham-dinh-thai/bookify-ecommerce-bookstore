import { MyOrderReadModel } from '../read-models/my-order.read-model';
import { OrderDetailReadModel } from '../read-models/order-detail.read-model';
import { OrderReadModel } from '../read-models/order.read-model';

export interface IOrdersQueryRepository {
  findAll(): Promise<OrderReadModel[]>;

  findUserOrders(userId: string): Promise<MyOrderReadModel[]>;

  findOne(id: string): Promise<OrderReadModel | null>;

  findOrderDetail(orderId: string): Promise<OrderDetailReadModel | null>;
}

export const ORDERS_QUERY_REPOSITORY = 'IOrdersQueryRepository';
