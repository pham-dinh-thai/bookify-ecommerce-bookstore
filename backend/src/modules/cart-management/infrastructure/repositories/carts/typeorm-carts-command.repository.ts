import { Injectable } from '@nestjs/common';
import { ICartsCommandRepository } from '../../../domain/cart-aggregate/repositories/carts-command.repository.interface';
import { TypeOrmUnitOfWork } from '../../../../../shared/modules/unit-of-work/infrastructure/typeorm-unit-of-work';
import { CartItem } from '../../../domain/cart-aggregate/entities/cart-item.entity';
import { CartItemTypeOrm } from '../../entities/cart-item.entity';
import { Cart } from '../../../domain/cart-aggregate/cart.aggregate';
import { CartTypeOrm } from '../../entities/cart.entity';
import { CartsMapper } from '../../mappers/carts.mapper';
import { CartItemsMapper } from '../../mappers/cart-items.mapper';

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

    return CartsMapper.toDomain(cartTypeOrm);
  }

  public async addItemToCart(
    cartId: string,
    cartItem: CartItem,
  ): Promise<void> {
    await this.unitOfWork
      .getManager()
      .insert(CartItemTypeOrm, CartItemsMapper.toTypeOrm(cartId, cartItem));
  }

  public async updateItemQuantity(
    cartId: string,
    productId: string,
    quantity: number,
  ): Promise<void> {
    await this.unitOfWork.getManager().update(
      CartItemTypeOrm,
      {
        cartId,
        productId,
      },
      {
        quantity,
      },
    );
  }

  public async removeItem(cartId: string, productId: string): Promise<void> {
    await this.unitOfWork.getManager().delete(CartItemTypeOrm, {
      cartId: cartId,
      productId: productId,
    });
  }

  public async insert(cart: Cart): Promise<void> {
    await this.unitOfWork
      .getManager()
      .save(CartTypeOrm, CartsMapper.toTypeOrm(cart));
  }
}
