import { ReviewIdEmptyException } from './exceptions/review-id-empty.exception';
import { ReviewBookIdEmptyException } from './exceptions/review-book-id-empty.exception';
import { ReviewUserIdEmptyException } from './exceptions/review-user-id-empty.exception';
import { CreateReviewProps, FromPersistentReviewProps } from './types';
import { ReviewRating } from './value-objects/review-rating.value-object';

export class Review {
  private constructor(
    private readonly id: string,
    private readonly bookId: string,
    private readonly userId: string,
    private rating: ReviewRating,
    private comment: string | null,
    private readonly createdAt: Date,
    private updatedAt: Date,
  ) {}

  public static create(props: CreateReviewProps): Review {
    if (!props.id) {
      throw new ReviewIdEmptyException();
    }

    if (!props.bookId) {
      throw new ReviewBookIdEmptyException();
    }

    if (!props.userId) {
      throw new ReviewUserIdEmptyException();
    }

    return new Review(
      props.id,
      props.bookId,
      props.userId,
      ReviewRating.create(props.rating),
      props.comment ?? null,
      new Date(),
      new Date(),
    );
  }

  public static fromPersistent(props: FromPersistentReviewProps): Review {
    return new Review(
      props.id,
      props.bookId,
      props.userId,
      ReviewRating.create(props.rating),
      props.comment,
      props.createdAt,
      props.updatedAt,
    );
  }

  public getId(): string {
    return this.id;
  }

  public getBookId(): string {
    return this.bookId;
  }

  public getUserId(): string {
    return this.userId;
  }

  public getRating(): number {
    return this.rating.getValue();
  }

  public getComment(): string | null {
    return this.comment;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getUpdatedAt(): Date {
    return this.updatedAt;
  }

  public update(rating: number, comment: string | null): void {
    this.rating = ReviewRating.create(rating);
    this.comment = comment ?? null;
    this.updatedAt = new Date();
  }
}
