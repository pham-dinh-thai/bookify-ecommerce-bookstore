import { CartReadModel } from '../read-models/cart.read-model';

export interface ICartsQueryRepository {
  findUserCart(userId: string): Promise<CartReadModel | null>;
}

export const CARTS_QUERY_REPOSITORY = 'ICartsQueryRepository';
