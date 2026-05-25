import { Controller, Get, UseGuards } from '@nestjs/common';
import { FindMyBasicInfoUseCase } from '../../application/my-account-use-cases/find-my-basic-info/find-my-basic-info.use-case';
import { JwtAuthGuard } from '../../../../shared/http/guards/jwt-auth.guard';
import { CurrentUser } from '../../../../shared/http/decorators/current-user.decorator';
import { FindMyBasicInfoResponse } from '../../application/my-account-use-cases/find-my-basic-info/find-my-basic-info.response';
import { FindMyContactInfoResponse } from '../../application/my-account-use-cases/find-my-contact-info/find-my-contact-info.response';
import { FindMyContactInfoUseCase } from '../../application/my-account-use-cases/find-my-contact-info/find-my-contact-info.use-case';

@Controller('my-account')
@UseGuards(JwtAuthGuard)
export class MyAccountController {
  public constructor(
    private readonly findMyBasicInfoUseCase: FindMyBasicInfoUseCase,
    private readonly findMyContactInfoUseCase: FindMyContactInfoUseCase,
  ) {}

  @Get('/basic-info')
  public async findMyBasicInfo(
    @CurrentUser('userId') userId: string,
  ): Promise<FindMyBasicInfoResponse> {
    const response = await this.findMyBasicInfoUseCase.execute(userId);

    return response;
  }

  @Get('/contact-info')
  public async findMyContactInfo(
    @CurrentUser('userId') userId: string,
  ): Promise<FindMyContactInfoResponse> {
    const response = await this.findMyContactInfoUseCase.execute(userId);

    return response;
  }
}
