import { Cart } from '../cart.aggregate';
import { CartItem } from '../entities/cart-item.entity';

export interface ICartsCommandRepository {
  findUserCart(userId: string): Promise<Cart | null>;

  addItemToCart(cartId: string, cartItem: CartItem): Promise<void>;

  updateItemQuantity(
    cartId: string,
    productId: string,
    quantity: number,
  ): Promise<void>;

  removeItem(cartId: string, productId: string): Promise<void>;

  insert(cart: Cart): Promise<void>;
}

export const CARTS_COMMAND_REPOSITORY = 'ICartsCommandRepository';
