import { Inject, Injectable } from '@nestjs/common';
import { IAddItemToCartRequest } from './add-item-to-cart.request';
import {
  CARTS_COMMAND_REPOSITORY,
  type ICartsCommandRepository,
} from '../../../domain/cart-aggregate/repositories/carts-command.repository.interface';
import { Cart } from '../../../domain/cart-aggregate/cart.aggregate';
import {
  type IUuidGenerator,
  UUID_GENERATOR,
} from '../../../../../shared/modules/uuid/domain/uuid-generator.interface';

/**
 * Adds a product item to the user's cart.
 *
 * A cart is created on demand if the user does not have one yet —
 * carts should not exist until there is actual purchase intent.
 */
@Injectable()
export class AddItemToCartUseCase {
  public constructor(
    @Inject(CARTS_COMMAND_REPOSITORY)
    private readonly cartsCommandRepository: ICartsCommandRepository,

    @Inject(UUID_GENERATOR)
    private readonly uuidGenerator: IUuidGenerator,
  ) {}

  public async execute(
    request: IAddItemToCartRequest,
    userId: string,
  ): Promise<void> {
    let cart: Cart | null =
      await this.cartsCommandRepository.findUserCart(userId);

    if (cart === null) {
      cart = Cart.create({
        id: this.uuidGenerator.generate(),
        userId: userId,
      });

      await this.cartsCommandRepository.insert(cart);
    }

    const addedItem = cart.addItem({
      id: this.uuidGenerator.generate(),
      productId: request.productId,
      quantity: request.quantity,
      price: request.price,
    });

    await this.cartsCommandRepository.addItemToCart(cart.getId(), addedItem);
  }
}
