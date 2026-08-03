import { Inject, Injectable } from '@nestjs/common';
import { FindUserWishlistRequest } from './find-user-wishlist.request';
import { WishlistReadModel } from '../../../domain/read-models/wishlist.read-model';
import {
  type IWishlistsQueryRepository,
  WISHLISTS_QUERY_REPOSITORY,
} from '../../../domain/repositories/wishlists-query.repository.interface';

@Injectable()
export class FindUserWishlistUseCase {
  public constructor(
    @Inject(WISHLISTS_QUERY_REPOSITORY)
    private readonly wishlistsQueryRepository: IWishlistsQueryRepository,
  ) {}

  public async execute(
    request: FindUserWishlistRequest,
  ): Promise<WishlistReadModel | null> {
    return this.wishlistsQueryRepository.findUserWishlist(request.userId);
  }
}
