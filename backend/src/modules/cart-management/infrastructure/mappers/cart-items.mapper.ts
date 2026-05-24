import { CartItem } from '../../domain/cart-aggregate/entities/cart-item.entity';
import { CartItemTypeOrm } from '../entities/cart-item.entity';

export class CartItemsMapper {
  public static toTypeOrm(cartId: string, cartItem: CartItem): CartItemTypeOrm {
    const cartItemTypeOrm = new CartItemTypeOrm();

    cartItemTypeOrm.id = cartItem.getId();
    cartItemTypeOrm.cartId = cartId;
    cartItemTypeOrm.productId = cartItem.getProductId();
    cartItemTypeOrm.quantity = cartItem.getQuantity();
    cartItemTypeOrm.price = cartItem.getPrice();
    cartItemTypeOrm.isActive = cartItem.isActive();

    return cartItemTypeOrm;
  }
}
