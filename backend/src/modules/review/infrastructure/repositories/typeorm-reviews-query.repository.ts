import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm/repository/Repository.js';
import { ReviewReadModel } from '../../domain/read-models/review.read-model';
import { IReviewsQueryRepository } from '../../domain/repositories/reviews-query.repository.interface';
import { ReviewTypeOrm } from '../entities/review.entity';
import { ReviewsMapper } from '../mappers/reviews.mapper';

@Injectable()
export class TypeormReviewsQueryRepository implements IReviewsQueryRepository {
  public constructor(
    @InjectRepository(ReviewTypeOrm)
    private readonly repository: Repository<ReviewTypeOrm>,
  ) {}

  public async findByBook(bookId: string): Promise<ReviewReadModel[]> {
    const reviewTypeOrms = await this.repository.find({
      where: { bookId },
      relations: { user: true },
      order: { createdAt: 'DESC' },
    });

    return reviewTypeOrms.map((reviewTypeOrm) =>
      ReviewsMapper.toReadModel(reviewTypeOrm),
    );
  }

  public async findById(reviewId: string): Promise<ReviewReadModel | null> {
    const reviewTypeOrm = await this.repository.findOne({
      where: { id: reviewId },
      relations: { user: true },
    });

    return reviewTypeOrm ? ReviewsMapper.toReadModel(reviewTypeOrm) : null;
  }

  public async findByBookAndUser(
    bookId: string,
    userId: string,
  ): Promise<ReviewReadModel | null> {
    const reviewTypeOrm = await this.repository.findOne({
      where: { bookId, userId },
      relations: { user: true },
    });

    return reviewTypeOrm ? ReviewsMapper.toReadModel(reviewTypeOrm) : null;
  }

  public async existsByBookAndUser(
    bookId: string,
    userId: string,
  ): Promise<boolean> {
    return this.repository.exists({ where: { bookId, userId } });
  }
}
