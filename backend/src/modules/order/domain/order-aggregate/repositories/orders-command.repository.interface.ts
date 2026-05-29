import { Order } from '../order.aggregate';

export interface IOrdersCommandRepository {
  findOne(id: string): Promise<Order>;

  /**
   * Persists a newly placed order aggregate and all items that belong to it.
   */
  insert(order: Order): Promise<void>;

  save(order: Order): Promise<void>;
}

export const ORDERS_COMMAND_REPOSITORY = 'IOrdersCommandRepository';
