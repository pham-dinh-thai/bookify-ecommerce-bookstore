import { Injectable } from '@nestjs/common';
import { ICartsCommandRepository } from '../../../domain/cart-aggregate/repositories/carts-command.repository.interface';
import { TypeOrmUnitOfWork } from '../../../../../shared/modules/unit-of-work/infrastructure/typeorm-unit-of-work';
import { CartItem } from '../../../domain/cart-aggregate/entities/cart-item.entity';
import { CartItemTypeOrm } from '../../entities/cart-item.entity';
import { Cart } from '../../../domain/cart-aggregate/cart.aggregate';
import { CartTypeOrm } from '../../entities/cart.entity';

@Injectable()
export class TypeOrmCartsCommandRepository implements ICartsCommandRepository {
  public constructor(private readonly unitOfWork: TypeOrmUnitOfWork) {}

  public async findUserCart(userId: string): Promise<Cart | null> {
    const cartTypeOrm = await this.unitOfWork
      .getManager()
      .findOne(CartTypeOrm, {
        where: { userId },
        relations: { cartItems: true },
      });

    if (!cartTypeOrm) {
      return null;
    }

    return Cart.fromPersistent({
      id: cartTypeOrm.id,
      userId: cartTypeOrm.userId,
      items:
        cartTypeOrm.cartItems?.map((cartItem) => ({
          id: cartItem.id,
          productId: cartItem.productId,
          quantity: cartItem.quantity,
          price: cartItem.price,
          status: cartItem.isActive,
        })) ?? [],
    });
  }

  public async addItemToCart(
    cartId: string,
    cartItem: CartItem,
  ): Promise<void> {
    const cartItemTypeOrm = new CartItemTypeOrm();

    cartItemTypeOrm.id = cartItem.getId();
    cartItemTypeOrm.cartId = cartId;
    cartItemTypeOrm.productId = cartItem.getProductId();
    cartItemTypeOrm.quantity = cartItem.getQuantity();
    cartItemTypeOrm.price = cartItem.getPrice();
    cartItemTypeOrm.isActive = cartItem.isActive();

    await this.unitOfWork.getManager().insert(CartItemTypeOrm, cartItemTypeOrm);
  }

  public async removeItem(cartId: string, itemId: string): Promise<void> {
    await this.unitOfWork.getManager().delete(CartItemTypeOrm, {
      id: itemId,
      cartId: cartId,
    });
  }

  public async insert(cart: Cart): Promise<void> {
    const cartTypeOrm = new CartTypeOrm();

    cartTypeOrm.id = cart.getId();
    cartTypeOrm.userId = cart.getUserId();

    await this.unitOfWork.getManager().save(CartTypeOrm, cartTypeOrm);
  }
}
