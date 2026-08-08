import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UnitOfWorkModule } from '../../shared/modules/unit-of-work/unit-of-work.module';
import { UuidModule } from '../../shared/modules/uuid/uuid.module';
import { AuthenticationModule } from '../authentication/authentication.module';
import { OrderItemTypeOrm } from '../order/infrastructure/entities/order-item.entity';
import { OrderTypeOrm } from '../order/infrastructure/entities/order.entity';
import { AddReviewUseCase } from './application/use-cases/add-review/add-review.use-case';
import { REVIEWS_COMMAND_REPOSITORY } from './domain/repositories/reviews-command.repository.interface';
import { REVIEWS_QUERY_REPOSITORY } from './domain/repositories/reviews-query.repository.interface';
import { REVIEW_PURCHASE_VERIFIER } from './domain/services/review-purchase-verifier.service';
import { ReviewTypeOrm } from './infrastructure/entities/review.entity';
import { TypeormReviewsCommandRepository } from './infrastructure/repositories/typeorm-reviews-command.repository';
import { TypeormReviewsQueryRepository } from './infrastructure/repositories/typeorm-reviews-query.repository';
import { TypeormReviewPurchaseVerifier } from './infrastructure/services/review-purchase-verifier.service';

@Module({
  imports: [
    AuthenticationModule,
    TypeOrmModule.forFeature([ReviewTypeOrm, OrderItemTypeOrm, OrderTypeOrm]),
    UnitOfWorkModule,
    UuidModule,
  ],
  providers: [
    AddReviewUseCase,
    {
      provide: REVIEWS_COMMAND_REPOSITORY,
      useClass: TypeormReviewsCommandRepository,
    },
    {
      provide: REVIEWS_QUERY_REPOSITORY,
      useClass: TypeormReviewsQueryRepository,
    },
    {
      provide: REVIEW_PURCHASE_VERIFIER,
      useClass: TypeormReviewPurchaseVerifier,
    },
  ],
})
export class ReviewModule {}
