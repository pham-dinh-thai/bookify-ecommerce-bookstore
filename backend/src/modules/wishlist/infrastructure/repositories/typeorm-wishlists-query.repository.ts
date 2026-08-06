import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IWishlistsQueryRepository } from '../../domain/repositories/wishlists-query.repository.interface';
import { WishlistReadModel } from '../../domain/read-models/wishlist.read-model';
import { WishlistUserReadModel } from '../../domain/read-models/wishlist-user.read-model';
import { WishlistTypeOrm } from '../entities/wishlist.entity';
import { WishlistItemTypeOrm } from '../entities/wishlist-item.entity';
import { WishlistsMapper } from '../mappers/wishlists.mapper';

@Injectable()
export class TypeOrmWishlistsQueryRepository implements IWishlistsQueryRepository {
  public constructor(
    @InjectRepository(WishlistTypeOrm)
    private readonly repository: Repository<WishlistTypeOrm>,

    @InjectRepository(WishlistItemTypeOrm)
    private readonly wishlistItemRepository: Repository<WishlistItemTypeOrm>,
  ) {}

  public async findUserWishlist(
    userId: string,
  ): Promise<WishlistReadModel | null> {
    const wishlistTypeOrm = await this.repository.findOne({
      relations: {
        wishlistItems: {
          book: {
            covers: true,
            bookAuthors: {
              author: true,
            },
            bookGenres: {
              genre: true,
            },
          },
        },
      },
      where: { userId },
    });

    if (!wishlistTypeOrm) {
      return null;
    }

    return WishlistsMapper.toReadModel(wishlistTypeOrm);
  }

  public async findWishlistUsersByBookId(
    bookId: string,
  ): Promise<WishlistUserReadModel[]> {
    const wishlistItems = await this.wishlistItemRepository.find({
      relations: {
        wishlist: {
          user: true,
        },
      },
      where: { itemId: bookId },
    });

    const usersByUserId = new Map<string, WishlistUserReadModel>();

    for (const item of wishlistItems) {
      const user = item.wishlist.user;
      if (usersByUserId.has(user.id)) {
        continue;
      }

      usersByUserId.set(
        user.id,
        new WishlistUserReadModel(
          user.id,
          user.email,
          user.firstName,
          user.lastName,
        ),
      );
    }

    return [...usersByUserId.values()];
  }
}
