import { Order } from '../../domain/order-aggregate/order.aggregate';
import { MyOrderReadModel } from '../../domain/order-aggregate/read-models/my-order.read-model';
import { OrderItemPreviewReadModel } from '../../domain/order-aggregate/read-models/order-item-preview.read-model';
import { OrderTypeOrm } from '../entities/order.entity';

export class OrdersMapper {
  public static toDomain(orderTypeOrm: OrderTypeOrm): Order {
    return Order.fromPersistent({
      id: orderTypeOrm.id,
      userId: orderTypeOrm.userId,
      items: orderTypeOrm.items.map((item) => ({
        id: item.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      })),
      status: orderTypeOrm.status,
      paymentStatus: orderTypeOrm.paymentStatus,
      paymentMethod: orderTypeOrm.paymentMethod,
      shippingAddress: orderTypeOrm.shippingAddress,
      phoneNumber: orderTypeOrm.phoneNumber,
    });
  }

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

  public static toMyOrderReadModel(
    orderTypeOrm: OrderTypeOrm,
  ): MyOrderReadModel {
    const previewItems = orderTypeOrm.items.map((item) => {
      const primaryCover = item.product.covers?.find(
        (cover) => cover.isPrimary,
      );

      return new OrderItemPreviewReadModel(
        item.productId,
        item.product.title,
        primaryCover?.url ?? null,
        item.quantity,
      );
    });

    return new MyOrderReadModel(
      orderTypeOrm.id,
      orderTypeOrm.status,
      orderTypeOrm.paymentStatus,
      orderTypeOrm.items.reduce((total, item) => total + item.quantity, 0),
      previewItems,
      orderTypeOrm.createdAt,
    );
  }
}
