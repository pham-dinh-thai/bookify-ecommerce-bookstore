import { MyOrderReadModel } from '../read-models/my-order.read-model';
import { OrderDetailReadModel } from '../read-models/order-detail.read-model';
import { OrderReadModel } from '../read-models/order.read-model';

export interface IOrdersQueryRepository {
  findAll(
    page: number,
    limit: number,
    search?: string,
  ): Promise<OrderReadModel[]>;

  count(search?: string): Promise<number>;

  findUserOrders(userId: string): Promise<MyOrderReadModel[]>;

  findOne(id: string): Promise<OrderReadModel | null>;

  findOrderDetailById(orderId: string): Promise<OrderDetailReadModel>;

  findOrderDetail(
    userId: string,
    orderId: string,
  ): Promise<OrderDetailReadModel>;
}

export const ORDERS_QUERY_REPOSITORY = 'IOrdersQueryRepository';
