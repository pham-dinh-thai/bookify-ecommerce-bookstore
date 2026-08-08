import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../../../../shared/http/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../../../shared/http/guards/jwt-auth.guard';
import { AddReviewUseCase } from '../../application/use-cases/add-review/add-review.use-case';
import { DeleteReviewUseCase } from '../../application/use-cases/delete-review/delete-review.use-case';
import { FindBookReviewsUseCase } from '../../application/use-cases/find-book-reviews/find-book-reviews.use-case';
import { FindMyReviewUseCase } from '../../application/use-cases/find-my-review/find-my-review.use-case';
import { UpdateReviewUseCase } from '../../application/use-cases/update-review/update-review.use-case';
import { BookReviewsReadModel } from '../../domain/read-models/book-reviews.read-model';
import { MyReviewReadModel } from '../../domain/read-models/my-review.read-model';
import { AddReviewRequest } from './requests/add-review.request';
import { UpdateReviewRequest } from './requests/update-review.request';

@Controller('books')
export class ReviewsController {
  public constructor(
    private readonly findBookReviewsUseCase: FindBookReviewsUseCase,
    private readonly findMyReviewUseCase: FindMyReviewUseCase,
    private readonly addReviewUseCase: AddReviewUseCase,
    private readonly updateReviewUseCase: UpdateReviewUseCase,
    private readonly deleteReviewUseCase: DeleteReviewUseCase,
  ) {}

  @Get(':bookId/reviews')
  public async findBookReviews(
    @Param('bookId') bookId: string,
  ): Promise<BookReviewsReadModel> {
    return await this.findBookReviewsUseCase.execute(bookId);
  }

  @Post(':bookId/reviews')
  @UseGuards(JwtAuthGuard)
  public async addReview(
    @Param('bookId') bookId: string,
    @Body() request: AddReviewRequest,
    @CurrentUser('userId') userId: string,
  ): Promise<void> {
    await this.addReviewUseCase.execute(bookId, userId, request);
  }

  @Get(':bookId/reviews/mine')
  @UseGuards(JwtAuthGuard)
  public async findMyReview(
    @Param('bookId') bookId: string,
    @CurrentUser('userId') userId: string,
  ): Promise<MyReviewReadModel> {
    return await this.findMyReviewUseCase.execute(bookId, userId);
  }

  @Patch(':bookId/reviews/:reviewId')
  @UseGuards(JwtAuthGuard)
  public async updateReview(
    @Param('bookId') bookId: string,
    @Param('reviewId') reviewId: string,
    @Body() request: UpdateReviewRequest,
    @CurrentUser('userId') userId: string,
  ): Promise<void> {
    await this.updateReviewUseCase.execute(bookId, reviewId, userId, request);
  }

  @Delete(':bookId/reviews/:reviewId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  public async deleteReview(
    @Param('bookId') bookId: string,
    @Param('reviewId') reviewId: string,
    @CurrentUser('userId') userId: string,
  ): Promise<void> {
    await this.deleteReviewUseCase.execute(bookId, reviewId, userId);
  }
}
