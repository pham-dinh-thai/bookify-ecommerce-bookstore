import { Inject, Injectable } from '@nestjs/common';
import {
  type IWishlistsCommandRepository,
  WISHLISTS_COMMAND_REPOSITORY,
} from '../../../domain/repositories/wishlists-command.repository.interface';
import {
  CACHE_REPOSITORY,
  type ICacheRepository,
} from '../../../../../shared/modules/cache/domain/cache.repository.interface';
import { WISHLIST_CACHE_KEYS } from '../../wishlist-cache.constants';

@Injectable()
export class RemoveItemFromWishlistUseCase {
  public constructor(
    @Inject(WISHLISTS_COMMAND_REPOSITORY)
    private readonly wishlistsCommandRepository: IWishlistsCommandRepository,

    @Inject(CACHE_REPOSITORY)
    private readonly cacheRepository: ICacheRepository,
  ) {}

  public async execute(itemId: string, userId: string): Promise<void> {
    const wishlist =
      await this.wishlistsCommandRepository.findUserWishlistOrThrows(userId);

    wishlist.remove(itemId);

    await this.wishlistsCommandRepository.removeItemFromWishlist(
      wishlist.getId(),
      itemId,
    );

    await this.cacheRepository.del(WISHLIST_CACHE_KEYS.USER(userId));
  }
}
