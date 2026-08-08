import { Review } from '../../../domain/review.aggregate';
import { BookNotPurchasedException } from '../../../domain/exceptions/book-not-purchased.exception';
import { ReviewAlreadyExistsException } from '../../../domain/exceptions/review-already-exists.exception';
import type { IReviewsCommandRepository } from '../../../domain/repositories/reviews-command.repository.interface';
import type { IReviewsQueryRepository } from '../../../domain/repositories/reviews-query.repository.interface';
import { AddReviewUseCase } from './add-review.use-case';

describe('AddReviewUseCase', () => {
  const setup = (
    overrides: {
      hasPurchased?: boolean;
      alreadyReviewed?: boolean;
    } = {},
  ) => {
    let savedReview: Review | undefined;

    const reviewsCommandRepository = {
      save: jest.fn((review: Review) => {
        savedReview = review;
      }),
    };
    const reviewsQueryRepository = {
      existsByBookAndUser: jest
        .fn()
        .mockResolvedValue(overrides.alreadyReviewed ?? false),
    };
    const reviewPurchaseVerifier = {
      hasPurchased: jest.fn().mockResolvedValue(overrides.hasPurchased ?? true),
    };
    const uuidGenerator = {
      generate: jest.fn().mockReturnValue('review-1'),
    };

    const useCase = new AddReviewUseCase(
      reviewsCommandRepository as unknown as IReviewsCommandRepository,
      reviewsQueryRepository as unknown as IReviewsQueryRepository,
      reviewPurchaseVerifier,
      uuidGenerator,
    );

    return {
      useCase,
      reviewsCommandRepository,
      savedReview: () => savedReview,
    };
  };

  it('creates and saves a review when the book was purchased', async () => {
    const { useCase, reviewsCommandRepository, savedReview } = setup();

    await useCase.execute('book-1', 'user-1', {
      rating: 4.5,
      comment: 'Great read',
    });

    expect(reviewsCommandRepository.save).toHaveBeenCalledTimes(1);

    const review = savedReview();
    if (!review) {
      throw new Error('review was not saved');
    }

    expect(review.getBookId()).toBe('book-1');
    expect(review.getUserId()).toBe('user-1');
    expect(review.getRating()).toBe(4.5);
    expect(review.getComment()).toBe('Great read');
  });

  it('throws BookNotPurchasedException when the book was not purchased', async () => {
    const { useCase, reviewsCommandRepository } = setup({
      hasPurchased: false,
    });

    await expect(
      useCase.execute('book-1', 'user-1', { rating: 5 }),
    ).rejects.toBeInstanceOf(BookNotPurchasedException);
    expect(reviewsCommandRepository.save).not.toHaveBeenCalled();
  });

  it('throws ReviewAlreadyExistsException when the user already reviewed the book', async () => {
    const { useCase, reviewsCommandRepository } = setup({
      alreadyReviewed: true,
    });

    await expect(
      useCase.execute('book-1', 'user-1', { rating: 3.5 }),
    ).rejects.toBeInstanceOf(ReviewAlreadyExistsException);
    expect(reviewsCommandRepository.save).not.toHaveBeenCalled();
  });
});
