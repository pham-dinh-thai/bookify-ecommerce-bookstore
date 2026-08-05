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

@Injectable()
export class AddItemToWishlistUseCase {
  public constructor(
    @Inject(WISHLISTS_COMMAND_REPOSITORY)
    private readonly wishlistsCommandRepository: IWishlistsCommandRepository,

    @Inject(UUID_GENERATOR)
    private readonly uuidGenerator: IUuidGenerator,

    @Inject(UNIT_OF_WORK)
    private readonly unitOfWork: IUnitOfWork,
  ) {}

  public async execute(
    userId: string,
    request: IAddItemToWishlistRequest,
  ): Promise<void> {
    let wishlist =
      await this.wishlistsCommandRepository.findUserWishlist(userId);

    this.unitOfWork.execute(async () => {
      if (!wishlist) {
        wishlist = Wishlist.create({
          id: this.uuidGenerator.generate(),
          userId,
        });

        await this.wishlistsCommandRepository.create(wishlist);
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
  }
}
