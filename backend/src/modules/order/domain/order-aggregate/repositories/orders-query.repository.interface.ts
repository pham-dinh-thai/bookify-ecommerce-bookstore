import { OrderStatus } from '../enums/order-status.enum';
import { PaymentStatus } from '../enums/payment-status.enum';
import { MyOrderReadModel } from '../read-models/my-order.read-model';
import { OrderDetailReadModel } from '../read-models/order-detail.read-model';
import { OrderReadModel } from '../read-models/order.read-model';
import { TopAuthorReadModel } from '../../../../dashboard/domain/admin-dashboard-aggregate/read-models/top-author.read-model';
import { TopGenreReadModel } from '../../../../dashboard/domain/admin-dashboard-aggregate/read-models/top-genre.read-model';
import { TopLanguageReadModel } from '../../../../dashboard/domain/admin-dashboard-aggregate/read-models/top-language.read-model';
import { TopPublisherReadModel } from '../../../../dashboard/domain/admin-dashboard-aggregate/read-models/top-publisher.read-model';

export interface IOrdersQueryRepository {
  findAll(
    page: number,
    limit: number,
    search?: string,
  ): Promise<OrderReadModel[]>;

  findUserOrders(userId: string): Promise<MyOrderReadModel[]>;

  findRecent(limit: number): Promise<OrderReadModel[]>;

  findOne(id: string): Promise<OrderReadModel | null>;

  findOrderDetailById(orderId: string): Promise<OrderDetailReadModel>;

  findOrderDetail(
    userId: string,
    orderId: string,
  ): Promise<OrderDetailReadModel>;

  count(search?: string): Promise<number>;

  countByStatus(status: OrderStatus): Promise<number>;

  countByPaymentStatus(paymentStatus: PaymentStatus): Promise<number>;

  countWorkload(): Promise<{
    pending: number;
    confirmed: number;
    delivering: number;
    unpaidCod: number;
    deliveredUnpaid: number;
  }>;

  findTopGenresByUnitsSold(
    limit: number,
    since: Date,
  ): Promise<TopGenreReadModel[]>;

  findTopAuthorsByUnitsSold(
    limit: number,
    since: Date,
  ): Promise<TopAuthorReadModel[]>;

  findTopPublishersByUnitsSold(
    limit: number,
    since: Date,
  ): Promise<TopPublisherReadModel[]>;

  findTopLanguagesByUnitsSold(
    limit: number,
    since: Date,
  ): Promise<TopLanguageReadModel[]>;
}

export const ORDERS_QUERY_REPOSITORY = 'IOrdersQueryRepository';
