import { OrderItem } from '../../domain/order-aggregate/entities/order-item.entity';
import { OrderItemTypeOrm } from '../entities/order-item.entity';

export class OrderItemsMapper {
  public static toTypeOrm(orderId: string, item: OrderItem): OrderItemTypeOrm {
    const orderItemTypeOrm = new OrderItemTypeOrm();

    orderItemTypeOrm.id = item.getId();
    orderItemTypeOrm.orderId = orderId;
    orderItemTypeOrm.productId = item.getProductId();
    orderItemTypeOrm.quantity = item.getQuantity();
    orderItemTypeOrm.price = item.getPrice();

    return orderItemTypeOrm;
  }
}
