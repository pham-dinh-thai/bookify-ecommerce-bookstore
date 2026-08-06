import { Injectable } from '@nestjs/common';
import { BookReadModel } from '../../../domain/read-models/book.read-model';
import {
  IRecommendationStrategy,
  RecommendationContext,
} from './strategies/recommendation.strategy.interface';
import { WishlistBasedRecommendationStrategy } from './strategies/wishlist-based.recommendation.strategy';
import { RandomRecommendationStrategy } from './strategies/random.recommendation.strategy';

export class RecommendationResponse {
  public constructor(
    public readonly books: BookReadModel[],
    public readonly total: number,
  ) {}
}

/**
 *
 * Users arrive in very different states: signed out, signed in with an empty
 * wishlist, or signed in with rich wishlist data. so no single algorithm fits
 * everyone. Each source is a strategy tried in order, falling through until one
 * produces results. That way every user still gets a meaningful answer, and a new
 * recommendation source can be added without rewriting this use case.
 */
@Injectable()
export class FindRecommendationUseCase {
  private readonly strategies: IRecommendationStrategy[];

  public constructor(
    private readonly wishlistBasedRecommendationStrategy: WishlistBasedRecommendationStrategy,
    private readonly randomRecommendationStrategy: RandomRecommendationStrategy,
  ) {
    this.strategies = [
      wishlistBasedRecommendationStrategy,
      randomRecommendationStrategy,
    ];
  }

  public async execute(
    userId: string | undefined,
    page: number,
    limit: number,
  ): Promise<RecommendationResponse> {
    const context: RecommendationContext = { userId, page, limit };

    for (const strategy of this.strategies) {
      const books = await strategy.recommend(context);
      if (books.length > 0) {
        return new RecommendationResponse(books, books.length);
      }
    }

    return new RecommendationResponse([], 0);
  }
}
