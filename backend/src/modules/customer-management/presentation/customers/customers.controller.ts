import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import ExceptionHandler from '../../../../shared/domain/exception/exception.handler';
import { CompleteInformationRequest } from './requests/complete-information.request';
import { CompleteInformationUseCase } from '../../application/customer-use-cases/complete-information/complete-information.use-case';
import { FindCustomersUseCase } from '../../application/customer-use-cases/find-customers/find-customers.use-case';
import { CustomerReadModel } from '../../domain/customer-aggregate/read-models/customer.read-model';
import { JwtAuthGuard } from '../../../../shared/guards/jwt-auth.guard';
import { RoleGuard } from '../../../../shared/guards/role.guard';
import { Roles } from '../../../../shared/decorators/roles.decorator';
import { FindTotalCustomerUseCase } from '../../application/customer-use-cases/find-total-customer/find-total-customer.use-case';

@Controller('customers')
export class CustomersController {
  public constructor(
    private readonly completeInformationUseCase: CompleteInformationUseCase,
    private readonly findCustomersUseCase: FindCustomersUseCase,
    private readonly findTotalCustomerUseCase: FindTotalCustomerUseCase,
  ) {}

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('admin')
  @Get()
  public async findAll(): Promise<CustomerReadModel[]> {
    return await this.findCustomersUseCase.execute();
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('admin')
  @Get('total')
  public async total(): Promise<number> {
    const total = await this.findTotalCustomerUseCase.execute();

    return total;
  }

  @Post('complete-information')
  @UseGuards()
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
