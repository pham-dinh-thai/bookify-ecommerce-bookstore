import { Injectable } from '@nestjs/common';
import { TypeOrmUnitOfWork } from '../../../../shared/modules/unit-of-work/infrastructure/typeorm-unit-of-work';
import { Review } from '../../domain/review.aggregate';
import { IReviewsCommandRepository } from '../../domain/repositories/reviews-command.repository.interface';
import { ReviewTypeOrm } from '../entities/review.entity';
import { ReviewsMapper } from '../mappers/reviews.mapper';

@Injectable()
export class TypeormReviewsCommandRepository implements IReviewsCommandRepository {
  public constructor(private readonly unitOfWork: TypeOrmUnitOfWork) {}

  public async save(review: Review): Promise<void> {
    await this.unitOfWork
      .getManager()
      .insert(ReviewTypeOrm, ReviewsMapper.toTypeOrm(review));
  }
}
