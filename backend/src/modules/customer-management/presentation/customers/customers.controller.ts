import { Body, Controller, Param, Post, Query } from '@nestjs/common';
import ExceptionHandler from '../../../../shared/domain/exception/exception.handler';
import { CompleteInformationRequest } from './requests/complete-information.request';
import { CompleteInformationUseCase } from '../../application/customer-use-cases/complete-information/complete-information.use-case';

@Controller('customers')
export class CustomersController {
  public constructor(
    private readonly completeInformationUseCase: CompleteInformationUseCase,
  ) {}

  @Post('complete-information')
  public async completeInformation(
    @Query('token') token: string,
    @Body() request: CompleteInformationRequest,
  ) {
    try {
      await this.completeInformationUseCase.execute(token, request);
    } catch (error) {
      ExceptionHandler.handle(error);
    }
  }
}
