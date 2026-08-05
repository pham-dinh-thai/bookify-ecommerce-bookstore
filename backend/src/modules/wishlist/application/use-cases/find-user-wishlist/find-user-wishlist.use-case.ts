import { Inject, Injectable } from '@nestjs/common';
import { WishlistReadModel } from '../../../domain/read-models/wishlist.read-model';
import {
  type IWishlistsQueryRepository,
  WISHLISTS_QUERY_REPOSITORY,
} from '../../../domain/repositories/wishlists-query.repository.interface';
import {
  CACHE_REPOSITORY,
  type ICacheRepository,
} from '../../../../../shared/modules/cache/domain/cache.repository.interface';
import {
  WISHLIST_CACHE_KEYS,
  WISHLIST_CACHE_TTL,
} from '../../wishlist-cache.constants';

@Injectable()
export class FindUserWishlistUseCase {
  public constructor(
    @Inject(WISHLISTS_QUERY_REPOSITORY)
    private readonly wishlistsQueryRepository: IWishlistsQueryRepository,

    @Inject(CACHE_REPOSITORY)
    private readonly cacheRepository: ICacheRepository,
  ) {}

  public async execute(userId: string): Promise<WishlistReadModel | null> {
    const cacheKey = WISHLIST_CACHE_KEYS.USER(userId);

    const cached = await this.cacheRepository.get<WishlistReadModel>(cacheKey);
    if (cached) {
      return cached;
    }

    const wishlist =
      await this.wishlistsQueryRepository.findUserWishlist(userId);

    if (wishlist) {
      await this.cacheRepository.set(
        cacheKey,
        wishlist,
        WISHLIST_CACHE_TTL.USER,
      );
    }

    return wishlist;
  }
}
