import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IWishlistsQueryRepository } from '../../domain/repositories/wishlists-query.repository.interface';
import { WishlistReadModel } from '../../domain/read-models/wishlist.read-model';
import { WishlistTypeOrm } from '../entities/wishlist.entity';
import { WishlistsMapper } from '../mappers/wishlists.mapper';

@Injectable()
export class TypeOrmWishlistsQueryRepository implements IWishlistsQueryRepository {
  public constructor(
    @InjectRepository(WishlistTypeOrm)
    private readonly repository: Repository<WishlistTypeOrm>,
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
}
