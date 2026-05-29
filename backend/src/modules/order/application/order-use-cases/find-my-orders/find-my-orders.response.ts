import { MyOrderReadModel } from '../../../domain/order-aggregate/read-models/my-order.read-model';

export class FindMyOrdersResponse {
  public constructor(public readonly orders: MyOrderReadModel[]) {}
}
