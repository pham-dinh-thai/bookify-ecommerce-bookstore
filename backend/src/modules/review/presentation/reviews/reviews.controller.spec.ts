import { Test, TestingModule } from '@nestjs/testing';
import { AddReviewUseCase } from '../../application/use-cases/add-review/add-review.use-case';
import { DeleteReviewUseCase } from '../../application/use-cases/delete-review/delete-review.use-case';
import { FindBookReviewsUseCase } from '../../application/use-cases/find-book-reviews/find-book-reviews.use-case';
import { FindMyReviewUseCase } from '../../application/use-cases/find-my-review/find-my-review.use-case';
import { UpdateReviewUseCase } from '../../application/use-cases/update-review/update-review.use-case';
import { ReviewsController } from './reviews.controller';

describe('ReviewsController', () => {
  let controller: ReviewsController;
  let findBookReviewsUseCase: { execute: jest.Mock };

  beforeEach(async () => {
    findBookReviewsUseCase = { execute: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReviewsController],
      providers: [
        { provide: FindBookReviewsUseCase, useValue: findBookReviewsUseCase },
        { provide: FindMyReviewUseCase, useValue: { execute: jest.fn() } },
        { provide: AddReviewUseCase, useValue: { execute: jest.fn() } },
        { provide: UpdateReviewUseCase, useValue: { execute: jest.fn() } },
        { provide: DeleteReviewUseCase, useValue: { execute: jest.fn() } },
      ],
    }).compile();

    controller = module.get<ReviewsController>(ReviewsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('delegates findBookReviews to the use case', async () => {
    await controller.findBookReviews('book-1');

    expect(findBookReviewsUseCase.execute).toHaveBeenCalledWith('book-1');
  });
});
