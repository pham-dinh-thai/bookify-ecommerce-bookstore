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
