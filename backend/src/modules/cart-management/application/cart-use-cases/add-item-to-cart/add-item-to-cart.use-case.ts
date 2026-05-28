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
import {
  type IUnitOfWork,
  UNIT_OF_WORK,
} from '../../../../../shared/modules/unit-of-work/application/unit-of-work';

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

    @Inject(UNIT_OF_WORK)
    private readonly unitOfWork: IUnitOfWork,
  ) {}

  public async execute(
    request: IAddItemToCartRequest,
    userId: string,
  ): Promise<void> {
    const cart: Cart | null =
      await this.cartsCommandRepository.findUserCart(userId);
    const isNewCart = cart === null;
    const activeCart =
      cart ??
      Cart.create({
        id: this.uuidGenerator.generate(),
        userId: userId,
      });

    const existingItem = activeCart
      .getItems()
      .find((item) => item.getProductId() === request.productId);

    const addedItem = activeCart.addItem({
      id: this.uuidGenerator.generate(),
      productId: request.productId,
      quantity: request.quantity,
      price: request.price,
    });

    await this.unitOfWork.execute(async () => {
      if (isNewCart) {
        await this.cartsCommandRepository.insert(activeCart);
      }

      if (existingItem) {
        await this.cartsCommandRepository.updateItemQuantity(
          activeCart.getId(),
          addedItem.getProductId(),
          addedItem.getQuantity(),
        );

        return;
      }

      await this.cartsCommandRepository.addItemToCart(
        activeCart.getId(),
        addedItem,
      );
    });
  }
}
