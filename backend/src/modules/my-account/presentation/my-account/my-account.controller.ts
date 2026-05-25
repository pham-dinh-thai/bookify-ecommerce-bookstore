import { Controller, Get, UseGuards } from '@nestjs/common';
import { FindMyBasicInfoUseCase } from '../../application/my-account-use-cases/find-my-basic-info/find-my-basic-info.use-case';
import { JwtAuthGuard } from '../../../../shared/http/guards/jwt-auth.guard';
import { CurrentUser } from '../../../../shared/http/decorators/current-user.decorator';
import { FindMyBasicInfoResponse } from '../../application/my-account-use-cases/find-my-basic-info/find-my-basic-info.response';

@Controller('my-account')
@UseGuards(JwtAuthGuard)
export class MyAccountController {
  public constructor(
    private readonly findMyBasicInfoUseCase: FindMyBasicInfoUseCase,
  ) {}

  @Get('/basic-info')
  public async findMyBasicInfo(
    @CurrentUser('userId') userId: string,
  ): Promise<FindMyBasicInfoResponse> {
    const response = await this.findMyBasicInfoUseCase.execute(userId);

    return response;
  }
}
