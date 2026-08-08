import { Review } from '../../domain/review.aggregate';
import { ReviewReadModel } from '../../domain/read-models/review.read-model';
import { ReviewTypeOrm } from '../entities/review.entity';

export class ReviewsMapper {
  public static toTypeOrm(review: Review): ReviewTypeOrm {
    const reviewTypeOrm = new ReviewTypeOrm();

    reviewTypeOrm.id = review.getId();
    reviewTypeOrm.bookId = review.getBookId();
    reviewTypeOrm.userId = review.getUserId();
    reviewTypeOrm.rating = review.getRating();
    reviewTypeOrm.comment = review.getComment();

    return reviewTypeOrm;
  }

  public static fromPersistent(reviewTypeOrm: ReviewTypeOrm): Review {
    return Review.fromPersistent({
      id: reviewTypeOrm.id,
      bookId: reviewTypeOrm.bookId,
      userId: reviewTypeOrm.userId,
      rating: Number(reviewTypeOrm.rating),
      comment: reviewTypeOrm.comment,
      createdAt: reviewTypeOrm.createdAt,
      updatedAt: reviewTypeOrm.updatedAt,
    });
  }

  public static toReadModel(reviewTypeOrm: ReviewTypeOrm): ReviewReadModel {
    return new ReviewReadModel(
      reviewTypeOrm.id,
      reviewTypeOrm.bookId,
      reviewTypeOrm.userId,
      `${reviewTypeOrm.user.firstName} ${reviewTypeOrm.user.lastName}`.trim(),
      Number(reviewTypeOrm.rating),
      reviewTypeOrm.comment,
      reviewTypeOrm.createdAt,
      reviewTypeOrm.updatedAt,
    );
  }
}
