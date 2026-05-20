import { CartItemReadModel } from '../../domain/cart-aggregate/entities/read-models/cart-item.read-model';
import { CartReadModel } from '../../domain/cart-aggregate/read-models/cart.read-model';
import { CartTypeOrm } from '../entities/cart.entity';

export class CartsMapper {
  public static toReadModel(cartTypeOrm: CartTypeOrm): CartReadModel {
    return new CartReadModel(
      cartTypeOrm.id,
      cartTypeOrm.userId,
      cartTypeOrm.cartItems.map(
        (itemTypeOrm) =>
          new CartItemReadModel(
            itemTypeOrm.id,
            itemTypeOrm.productId,
            itemTypeOrm.quantity,
            itemTypeOrm.price,
            itemTypeOrm.isActive,
          ),
      ),
    );
  }
}
