import { Inject, Injectable } from '@nestjs/common';
import {
  CARTS_QUERY_REPOSITORY,
  type ICartsQueryRepository,
} from '../../../domain/cart-aggregate/repositories/carts-query.repository.interface';
import { CartReadModel } from '../../../domain/cart-aggregate/read-models/cart.read-model';

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
