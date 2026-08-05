import { Inject, Injectable } from '@nestjs/common';
import {
  type IWishlistsCommandRepository,
  WISHLISTS_COMMAND_REPOSITORY,
} from '../../../domain/repositories/wishlists-command.repository.interface';

@Injectable()
export class RemoveItemFromWishlistUseCase {
  public constructor(
    @Inject(WISHLISTS_COMMAND_REPOSITORY)
    private readonly wishlistsCommandRepository: IWishlistsCommandRepository,
  ) {}

  public async execute(itemId: string, userId: string): Promise<void> {
    const wishlist =
      await this.wishlistsCommandRepository.findUserWishlistOrThrows(userId);

    wishlist.remove(itemId);

    await this.wishlistsCommandRepository.removeItemFromWishlist(
      wishlist.getId(),
      itemId,
    );
  }
}
