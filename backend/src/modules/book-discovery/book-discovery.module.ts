import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookTypeOrm } from '../book-management/infrastructure/entities/book.entity';
import { SharedCacheModule } from '../../shared/modules/cache/cache.module';
import { WishlistModule } from '../wishlist/wishlist.module';
import { AuthenticationModule } from '../authentication/authentication.module';
import { ShopCollectionsController } from './presentation/shop-collections/shop-collections.controller';
import { RecommendationsController } from './presentation/recommendations/recommendations.controller';
import { FindShopCollectionBooksUseCase } from './application/use-cases/find-shop-collection-books/find-shop-collection-books.use-case';
import { FindRecommendationUseCase } from './application/use-cases/find-recommendation/find-recommendation.use-case';
import { WishlistBasedRecommendationStrategy } from './application/use-cases/find-recommendation/strategies/wishlist-based.recommendation.strategy';
import { RandomRecommendationStrategy } from './application/use-cases/find-recommendation/strategies/random.recommendation.strategy';
import { DISCOVERY_BOOKS_QUERY_REPOSITORY } from './domain/repositories/books-query.repository.interface';
import { TypeOrmDiscoveryBooksQueryRepository } from './infrastructure/repositories/typeorm-discovery-books-query.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([BookTypeOrm]),
    SharedCacheModule,
    WishlistModule,
    AuthenticationModule,
  ],
  controllers: [ShopCollectionsController, RecommendationsController],
  providers: [
    FindShopCollectionBooksUseCase,
    FindRecommendationUseCase,
    WishlistBasedRecommendationStrategy,
    RandomRecommendationStrategy,
    {
      provide: DISCOVERY_BOOKS_QUERY_REPOSITORY,
      useClass: TypeOrmDiscoveryBooksQueryRepository,
    },
  ],
})
export class BookDiscoveryModule {}
