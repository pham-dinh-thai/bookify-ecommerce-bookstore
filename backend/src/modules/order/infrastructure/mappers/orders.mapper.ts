import { Order } from '../../domain/order-aggregate/order.aggregate';
import { OrderTypeOrm } from '../entities/order.entity';

export class OrdersMapper {
  public static toTypeOrm(order: Order): OrderTypeOrm {
    const orderTypeOrm = new OrderTypeOrm();

    orderTypeOrm.id = order.getId();
    orderTypeOrm.userId = order.getUserId();
    orderTypeOrm.status = order.getStatus();
    orderTypeOrm.paymentStatus = order.getPaymentStatus();
    orderTypeOrm.paymentMethod = order.getPaymentMethod();
    orderTypeOrm.shippingAddress = order.getShippingAddress();
    orderTypeOrm.phoneNumber = order.getPhoneNumber();

    return orderTypeOrm;
  }
}
