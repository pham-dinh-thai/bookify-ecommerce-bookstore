import { Inject, Injectable } from '@nestjs/common';
import {
  CARTS_QUERY_REPOSITORY,
  type ICartsQueryRepository,
} from '../../../domain/cart-aggregate/repositories/carts-query.repository.interface';
import { CartReadModel } from '../../../domain/cart-aggregate/read-models/cart.read-model';

/**
 * Retrieves the current user's cart for display purposes.
 *
 * Uses the query repository (read side) rather than the command repository
 * to return a flattened read model — callers need a view of the cart,
 * not a domain aggregate to mutate.
 */
@Injectable()
export class FindUserCartUseCase {
  public constructor(
    @Inject(CARTS_QUERY_REPOSITORY)
    private readonly cartsQueryRepository: ICartsQueryRepository,
  ) {}

  public async execute(userId: string): Promise<CartReadModel | null> {
    const cart: CartReadModel | null =
      await this.cartsQueryRepository.findUserCart(userId);

    return cart;
  }
}
