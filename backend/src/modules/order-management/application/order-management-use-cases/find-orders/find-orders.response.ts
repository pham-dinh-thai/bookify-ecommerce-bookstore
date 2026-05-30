import { OrderReadModel } from '../../../../order/domain/order-aggregate/read-models/order.read-model';

export class FindOrdersResponse {
  public constructor(public readonly orders: OrderReadModel[]) {}
}
