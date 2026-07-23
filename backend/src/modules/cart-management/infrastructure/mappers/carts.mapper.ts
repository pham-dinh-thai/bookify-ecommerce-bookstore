import { Cart } from '../../domain/cart-aggregate/cart.aggregate';
import { CartItemReadModel } from '../../domain/cart-aggregate/entities/read-models/cart-item.read-model';
import { CartReadModel } from '../../domain/cart-aggregate/read-models/cart.read-model';
import { CartTypeOrm } from '../entities/cart.entity';

export class CartsMapper {
  public static toDomain(cartTypeOrm: CartTypeOrm): Cart {
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

  public static toTypeOrm(cart: Cart): CartTypeOrm {
    const cartTypeOrm = new CartTypeOrm();

    cartTypeOrm.id = cart.getId();
    cartTypeOrm.userId = cart.getUserId();

    return cartTypeOrm;
  }

  public static toReadModel(cartTypeOrm: CartTypeOrm): CartReadModel {
    return new CartReadModel(
      cartTypeOrm.id,
      cartTypeOrm.userId,
      cartTypeOrm.cartItems.map((itemTypeOrm) => {
        const book = itemTypeOrm.product;
        const covers = book?.covers ?? [];
        const primaryCover = covers.find((c) => c.isPrimary) ?? covers[0];
        const authorNames =
          book?.bookAuthors
            ?.map((ba) => ba.author?.name)
            .filter(Boolean)
            .join(', ') ?? '';

        return new CartItemReadModel(
          itemTypeOrm.id,
          itemTypeOrm.productId,
          itemTypeOrm.quantity,
          itemTypeOrm.price,
          itemTypeOrm.isActive,
          book?.title ?? '',
          authorNames,
          '',
          primaryCover?.url ?? '',
          book?.quantity ?? 0,
          (book?.quantity ?? 0) > 0,
        );
      }),
    );
  }
}
