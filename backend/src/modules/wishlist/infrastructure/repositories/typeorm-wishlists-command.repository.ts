import { Injectable } from '@nestjs/common';
import { IWishlistsCommandRepository } from '../../domain/repositories/wishlists-command.repository.interface';
import { TypeOrmUnitOfWork } from '../../../../shared/modules/unit-of-work/infrastructure/typeorm-unit-of-work';
import { Wishlist } from '../../domain/wishlist.aggregate';
import { WishlistTypeOrm } from '../entities/wishlist.entity';
import { WishlistItem } from '../../domain/entities/wishlist-item.entity';
import { WishlistsMapper } from '../mappers/wishlists.mapper';
import { WishlistItemTypeOrm } from '../entities/wishlist-item.entity';
import { WishlistItemsMapper } from '../mappers/wishlist-items.mapper';
import { WishlistNotFoundException } from '../../domain/exceptions/wishlist-not-found.exception';

@Injectable()
export class TypeOrmWishlistsCommandRepository implements IWishlistsCommandRepository {
  public constructor(private readonly unitOfWork: TypeOrmUnitOfWork) {}

  public async findUserWishlist(userId: string): Promise<Wishlist | null> {
    const wishlist = await this.unitOfWork
      .getManager()
      .findOne(WishlistTypeOrm, {
        where: { userId },
        relations: { wishlistItems: true },
      });

    return wishlist
      ? Wishlist.fromPersistent({
          id: wishlist.id,
          userId: wishlist.userId,
          items: wishlist.wishlistItems.map((item) => {
            return WishlistItem.fromPersistent({
              id: item.id,
              itemId: item.itemId,
            });
          }),
        })
      : null;
  }

  public async findUserWishlistOrThrows(userId: string): Promise<Wishlist> {
    const wishlist = await this.unitOfWork
      .getManager()
      .findOne(WishlistTypeOrm, {
        where: { userId },
        relations: { wishlistItems: true },
      });

    if (!wishlist) {
      throw new WishlistNotFoundException();
    }

    return Wishlist.fromPersistent({
      id: wishlist.id,
      userId: wishlist.userId,
      items: wishlist.wishlistItems.map((item) => {
        return WishlistItem.fromPersistent({
          id: item.id,
          itemId: item.itemId,
        });
      }),
    });
  }

  public async create(wishlist: Wishlist): Promise<void> {
    await this.unitOfWork
      .getManager()
      .insert(WishlistTypeOrm, WishlistsMapper.toTypeOrm(wishlist));
  }

  public async addItemToWishlist(
    wishlistId: string,
    wishlistItem: WishlistItem,
  ): Promise<void> {
    await this.unitOfWork
      .getManager()
      .insert(
        WishlistItemTypeOrm,
        WishlistItemsMapper.toTypeOrm(wishlistId, wishlistItem),
      );
  }

  public async removeItemFromWishlist(
    wishlistId: string,
    itemId: string,
  ): Promise<void> {
    await this.unitOfWork
      .getManager()
      .delete(WishlistItemTypeOrm, { wishlistId, itemId });
  }
}
