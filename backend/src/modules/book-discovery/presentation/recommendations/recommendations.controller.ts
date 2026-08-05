import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { OptionalJwtAuthGuard } from '../../../../shared/http/guards/optional-jwt-auth.guard';
import { CurrentUser } from '../../../../shared/http/decorators/current-user.decorator';
import { FindRecommendationUseCase } from '../../application/use-cases/find-recommendation/find-recommendation.use-case';
import type { RecommendationResponse } from '../../application/use-cases/find-recommendation/find-recommendation.use-case';

@Controller('recommendations')
@UseGuards(OptionalJwtAuthGuard)
export class RecommendationsController {
  public constructor(
    private readonly findRecommendationUseCase: FindRecommendationUseCase,
  ) {}

  @Get()
  public async findRecommendation(
    @CurrentUser('userId') userId: string | undefined,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ): Promise<RecommendationResponse> {
    return this.findRecommendationUseCase.execute(
      userId,
      parseInt(page, 10),
      parseInt(limit, 10),
    );
  }
}
