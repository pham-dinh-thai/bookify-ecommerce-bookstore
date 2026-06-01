import { Order } from '../../domain/order-aggregate/order.aggregate';
import { MyOrderReadModel } from '../../domain/order-aggregate/read-models/my-order.read-model';
import { OrderReadModel } from '../../domain/order-aggregate/read-models/order.read-model';
import { OrderDetailItemReadModel } from '../../domain/order-aggregate/read-models/order-detail-item.read-model';
import { OrderDetailReadModel } from '../../domain/order-aggregate/read-models/order-detail.read-model';
import { OrderItemPreviewReadModel } from '../../domain/order-aggregate/read-models/order-item-preview.read-model';
import { OrderTypeOrm } from '../entities/order.entity';

export class OrdersMapper {
  public static toDomain(orderTypeOrm: OrderTypeOrm): Order {
    return Order.fromPersistent({
      id: orderTypeOrm.id,
      orderCode: orderTypeOrm.orderCode,
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
    orderTypeOrm.orderCode = order.getOrderCode();
    orderTypeOrm.userId = order.getUserId();
    orderTypeOrm.status = order.getStatus();
    orderTypeOrm.paymentStatus = order.getPaymentStatus();
    orderTypeOrm.paymentMethod = order.getPaymentMethod();
    orderTypeOrm.shippingAddress = order.getShippingAddress();
    orderTypeOrm.phoneNumber = order.getPhoneNumber();

    return orderTypeOrm;
  }

  public static toOrderReadModel(orderTypeOrm: OrderTypeOrm): OrderReadModel {
    const totalAmount = orderTypeOrm.items.reduce(
      (total, item) => total + Number(item.price) * item.quantity,
      0,
    );
    const totalItems = orderTypeOrm.items.reduce(
      (total, item) => total + item.quantity,
      0,
    );

    return new OrderReadModel(
      orderTypeOrm.id,
      OrdersMapper.getDisplayOrderCode(orderTypeOrm),
      orderTypeOrm.status,
      orderTypeOrm.paymentStatus,
      orderTypeOrm.paymentMethod,
      totalAmount,
      totalItems,
      orderTypeOrm.createdAt,
    );
  }

  public static toMyOrderReadModel(
    orderTypeOrm: OrderTypeOrm,
  ): MyOrderReadModel {
    const previewItems = orderTypeOrm.items.map((item) => {
      const primaryCover = item.product.covers?.find(
        (cover) => cover.isPrimary,
      );

      const unitPrice = Number(item.price);

      return new OrderItemPreviewReadModel(
        item.productId,
        item.product.title,
        primaryCover?.url ?? null,
        item.quantity,
        unitPrice,
        unitPrice * item.quantity,
      );
    });
    const totalItems = orderTypeOrm.items.reduce(
      (total, item) => total + item.quantity,
      0,
    );
    const totalAmount = previewItems.reduce(
      (total, item) => total + item.lineTotal,
      0,
    );

    return new MyOrderReadModel(
      orderTypeOrm.id,
      OrdersMapper.getDisplayOrderCode(orderTypeOrm),
      orderTypeOrm.status,
      orderTypeOrm.paymentStatus,
      totalItems,
      totalAmount,
      previewItems,
      orderTypeOrm.createdAt,
    );
  }

  public static toOrderDetailReadModel(
    orderTypeOrm: OrderTypeOrm,
  ): OrderDetailReadModel {
    const items = orderTypeOrm.items.map((item) => {
      const primaryCover = item.product.covers?.find(
        (cover) => cover.isPrimary,
      );
      const unitPrice = Number(item.price);

      return new OrderDetailItemReadModel(
        item.id,
        item.productId,
        item.product.title,
        primaryCover?.url ?? null,
        item.quantity,
        unitPrice,
        unitPrice * item.quantity,
      );
    });

    const totalItems = items.reduce((total, item) => total + item.quantity, 0);
    const totalAmount = items.reduce(
      (total, item) => total + item.lineTotal,
      0,
    );

    return new OrderDetailReadModel(
      orderTypeOrm.id,
      OrdersMapper.getDisplayOrderCode(orderTypeOrm),
      orderTypeOrm.userId,
      orderTypeOrm.status,
      orderTypeOrm.paymentStatus,
      orderTypeOrm.paymentMethod,
      orderTypeOrm.shippingAddress,
      orderTypeOrm.phoneNumber,
      totalItems,
      totalAmount,
      items,
      orderTypeOrm.createdAt,
      orderTypeOrm.updatedAt,
    );
  }

  private static getDisplayOrderCode(orderTypeOrm: OrderTypeOrm): string {
    return orderTypeOrm.orderCode;
  }
}
