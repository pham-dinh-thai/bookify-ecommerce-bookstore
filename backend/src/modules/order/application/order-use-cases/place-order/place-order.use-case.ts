import { Inject, Injectable } from '@nestjs/common';
import { IPlaceOrderRequest } from './place-order.request';
import { Order } from '../../../domain/order-aggregate/order.aggregate';
import {
  type IUuidGenerator,
  UUID_GENERATOR,
} from '../../../../../shared/modules/uuid/domain/uuid-generator.interface';

@Injectable()
export class PlaceOrderUseCase {
  public constructor(
    @Inject(UUID_GENERATOR)
    private readonly uuidGenerator: IUuidGenerator,
  ) {}

  public async execute(
    request: IPlaceOrderRequest,
    userId: string,
  ): Promise<Order> {
    const order: Order = Order.create({
      id: this.uuidGenerator.generate(),
      userId: userId,
      paymentMethod: request.paymentMethod,
    });

    for (const item of request.items) {
      order.addItem({
        id: this.uuidGenerator.generate(),
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      });
    }

    return order;
  }
}
