import { Inject, Injectable } from '@nestjs/common';
import {
  IRecommendationStrategy,
  RecommendationContext,
} from './recommendation.strategy.interface';
import {
  DISCOVERY_BOOKS_QUERY_REPOSITORY,
  type IDiscoveryBooksQueryRepository,
} from '../../../../domain/repositories/books-query.repository.interface';
import { BookReadModel } from '../../../../domain/read-models/book.read-model';

/**
 * Returns a random selection of books. This is the safety net of the chain: it
 * needs no user data at all, so it always succeeds and guarantees signed-out users
 * (or users whose wishlist yields nothing) still get recommendations.
 */
@Injectable()
export class RandomRecommendationStrategy implements IRecommendationStrategy {
  public constructor(
    @Inject(DISCOVERY_BOOKS_QUERY_REPOSITORY)
    private readonly booksQueryRepository: IDiscoveryBooksQueryRepository,
  ) {}

  public async recommend(
    context: RecommendationContext,
  ): Promise<BookReadModel[]> {
    return this.booksQueryRepository.findRandom(context.page, context.limit);
  }
}
