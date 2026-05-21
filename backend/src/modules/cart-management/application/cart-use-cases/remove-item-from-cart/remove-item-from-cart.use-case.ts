import { Inject, Injectable } from '@nestjs/common';
import {
  CARTS_COMMAND_REPOSITORY,
  type ICartsCommandRepository,
} from '../../../domain/cart-aggregate/repositories/carts-command.repository.interface';
import { Cart } from '../../../domain/cart-aggregate/cart.aggregate';
import { CartNotFoundException } from '../../../domain/cart-aggregate/exceptions/car-not-found.exception';
import {
  type IUnitOfWork,
  UNIT_OF_WORK,
} from '../../../../../shared/modules/unit-of-work/application/unit-of-work';

@Injectable()
export class RemoveItemFromCartUseCase {
  public constructor(
    @Inject(CARTS_COMMAND_REPOSITORY)
    private readonly cartsCommandRepository: ICartsCommandRepository,

    @Inject(UNIT_OF_WORK)
    private readonly unitOfWork: IUnitOfWork,
  ) {}

  public async execute(itemId: string, userId: string): Promise<void> {
    const cart: Cart | null =
      await this.cartsCommandRepository.findUserCart(userId);

    if (!cart) {
      throw new CartNotFoundException();
    }

    const { deletedId } = cart.removeItem(itemId);

    await this.unitOfWork.execute(async () => {
      await this.cartsCommandRepository.removeItem(cart.getId(), deletedId);
    });
  }
}
