import { OrderStatus } from '../../../../order/domain/order-aggregate/enums/order-status.enum';

export interface IUpdateOrderStatusRequest {
  status: OrderStatus;
}
