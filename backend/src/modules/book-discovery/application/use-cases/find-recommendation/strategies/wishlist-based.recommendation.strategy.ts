import { Inject, Injectable } from '@nestjs/common';
import {
  DISCOVERY_BOOKS_QUERY_REPOSITORY,
  type IDiscoveryBooksQueryRepository,
} from '../../../../domain/repositories/books-query.repository.interface';
import {
  type IWishlistsQueryRepository,
  WISHLISTS_QUERY_REPOSITORY,
} from '../../../../../wishlist/domain/repositories/wishlists-query.repository.interface';
import {
  IRecommendationStrategy,
  RecommendationContext,
} from './recommendation.strategy.interface';
import { BookReadModel } from '../../../../domain/read-models/book.read-model';

@Injectable()
export class WishlistBasedRecommendationStrategy implements IRecommendationStrategy {
  public constructor(
    @Inject(DISCOVERY_BOOKS_QUERY_REPOSITORY)
    private readonly booksQueryRepository: IDiscoveryBooksQueryRepository,

    @Inject(WISHLISTS_QUERY_REPOSITORY)
    private readonly wishlistsQueryRepository: IWishlistsQueryRepository,
  ) {}

  public async recommend(
    context: RecommendationContext,
  ): Promise<BookReadModel[]> {
    if (!context.userId) {
      return [];
    }

    const wishlist = await this.wishlistsQueryRepository.findUserWishlist(
      context.userId,
    );

    if (!wishlist || wishlist.genreIds.length === 0) {
      return [];
    }

    return this.booksQueryRepository.findByGenres(
      wishlist.genreIds,
      wishlist.bookIds,
      context.page,
      context.limit,
    );
  }
}
