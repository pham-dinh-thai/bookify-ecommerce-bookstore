import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { CompleteInformationRequest } from './requests/complete-information.request';
import { CompleteInformationUseCase } from '../../application/customer-use-cases/complete-information/complete-information.use-case';
import { FindCustomersUseCase } from '../../application/customer-use-cases/find-customers/find-customers.use-case';
import { FindCustomersResponse } from '../../application/customer-use-cases/find-customers/find-customers.response';
import { JwtAuthGuard } from '../../../../shared/http/guards/jwt-auth.guard';
import { RoleGuard } from '../../../../shared/http/guards/role.guard';
import { Roles } from '../../../../shared/http/decorators/roles.decorator';
import { FindTotalCustomerUseCase } from '../../application/customer-use-cases/find-total-customer/find-total-customer.use-case';
import { CustomerFilter } from '../../domain/customer-aggregate/customer.filter';

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
  public async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('isActive') isActive?: string,
    @Query('search') search?: string,
  ): Promise<FindCustomersResponse> {
    const filter = new CustomerFilter(
      isActive !== undefined ? isActive === 'true' : undefined,
    );

    const response = await this.findCustomersUseCase.execute(
      parseInt(page),
      parseInt(limit),
      filter,
      search,
    );

    return response;
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
    await this.completeInformationUseCase.execute(token, request);
  }
}
