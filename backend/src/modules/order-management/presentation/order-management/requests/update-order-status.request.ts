import { IsEnum, IsNotEmpty } from 'class-validator';
import { IUpdateOrderStatusRequest } from '../../../application/order-management-use-cases/update-order-status/update-order-status.request';
import { OrderStatus } from '../../../../order/domain/order-aggregate/enums/order-status.enum';

export class UpdateOrderStatusRequest implements IUpdateOrderStatusRequest {
  @IsEnum(OrderStatus)
  @IsNotEmpty()
  status!: OrderStatus;
}
