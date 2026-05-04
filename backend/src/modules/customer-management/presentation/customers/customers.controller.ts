import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import ExceptionHandler from '../../../../shared/domain/exception/exception.handler';
import { CompleteInformationRequest } from './requests/complete-information.request';
import { CompleteInformationUseCase } from '../../application/customer-use-cases/complete-information/complete-information.use-case';
import { FindCustomersUseCase } from '../../application/customer-use-cases/find-customers/find-customers.use-case';
import { CustomerReadModel } from '../../domain/customer-aggregate/read-models/customer.read-model';

@Controller('customers')
export class CustomersController {
  public constructor(
    private readonly completeInformationUseCase: CompleteInformationUseCase,
    private readonly findCustomersUseCase: FindCustomersUseCase,
  ) {}

  @Get()
  public async findAll(): Promise<CustomerReadModel[]> {
    return await this.findCustomersUseCase.execute();
  }

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
