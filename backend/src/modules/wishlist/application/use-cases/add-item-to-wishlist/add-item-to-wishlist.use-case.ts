import { Inject, Injectable } from '@nestjs/common';
import { IAddItemToWishlistRequest } from './add-item-to-wishlist.request';
import {
  type IWishlistsCommandRepository,
  WISHLISTS_COMMAND_REPOSITORY,
} from '../../../domain/repositories/wishlists-command.repository.interface';
import { Wishlist } from '../../../domain/wishlist.aggregate';
import {
  type IUuidGenerator,
  UUID_GENERATOR,
} from '../../../../../shared/modules/uuid/domain/uuid-generator.interface';
import {
  type IUnitOfWork,
  UNIT_OF_WORK,
} from '../../../../../shared/modules/unit-of-work/application/unit-of-work';
import {
  CACHE_REPOSITORY,
  type ICacheRepository,
} from '../../../../../shared/modules/cache/domain/cache.repository.interface';
import { WISHLIST_CACHE_KEYS } from '../../wishlist-cache.constants';

@Injectable()
export class AddItemToWishlistUseCase {
  public constructor(
    @Inject(WISHLISTS_COMMAND_REPOSITORY)
    private readonly wishlistsCommandRepository: IWishlistsCommandRepository,

    @Inject(UUID_GENERATOR)
    private readonly uuidGenerator: IUuidGenerator,

    @Inject(UNIT_OF_WORK)
    private readonly unitOfWork: IUnitOfWork,

    @Inject(CACHE_REPOSITORY)
    private readonly cacheRepository: ICacheRepository,
  ) {}

  public async execute(
    userId: string,
    request: IAddItemToWishlistRequest,
  ): Promise<void> {
    let wishlist =
      await this.wishlistsCommandRepository.findUserWishlist(userId);

    let itemAdded = true;

    await this.unitOfWork.execute(async () => {
      if (!wishlist) {
        wishlist = Wishlist.create({
          id: this.uuidGenerator.generate(),
          userId,
        });

        await this.wishlistsCommandRepository.create(wishlist);
      }

      if (wishlist.hasItem(request.itemId)) {
        itemAdded = false;
        return;
      }

      const addedItem = wishlist.addItem({
        id: this.uuidGenerator.generate(),
        itemId: request.itemId,
      });

      await this.wishlistsCommandRepository.addItemToWishlist(
        wishlist.getId(),
        addedItem,
      );
    });

    if (itemAdded) {
      await this.cacheRepository.del(WISHLIST_CACHE_KEYS.USER(userId));
    }
  }
}
