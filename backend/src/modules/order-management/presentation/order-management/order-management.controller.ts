import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UpdateOrderStatusUseCase } from '../../application/order-management-use-cases/update-order-status/update-order-status.use-case';
import { JwtAuthGuard } from '../../../../shared/http/guards/jwt-auth.guard';
import { RoleGuard } from '../../../../shared/http/guards/role.guard';
import { Roles } from '../../../../shared/http/decorators/roles.decorator';
import { UpdateOrderStatusRequest } from './requests/update-order-status.request';
import { CurrentUser } from '../../../../shared/http/decorators/current-user.decorator';
import { FindOrdersUseCase } from '../../application/order-management-use-cases/find-orders/find-orders.use-case';
import { FindOrdersResponse } from '../../application/order-management-use-cases/find-orders/find-orders.response';
import { FindOrderDetailUseCase } from '../../application/order-management-use-cases/find-order-detail/find-order-detail.use-case';
import { OrderDetailReadModel } from '../../../../modules/order/domain/order-aggregate/read-models/order-detail.read-model';
import { MarkOrderAsPaidUseCase } from '../../application/order-management-use-cases/mark-order-as-paid/mark-order-as-paid.use-case';

@Controller('orders')
@UseGuards(JwtAuthGuard, RoleGuard)
@Roles('admin', 'staff')
export class OrderManagementController {
  public constructor(
    private readonly findOrdersUseCase: FindOrdersUseCase,
    private readonly findOrderDetailUseCase: FindOrderDetailUseCase,
    private readonly updateOrderStatusUseCase: UpdateOrderStatusUseCase,
    private readonly markOrderAsPaidUseCase: MarkOrderAsPaidUseCase,
  ) {}

  @Get()
  public async findOrders(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('search') search?: string,
  ): Promise<FindOrdersResponse> {
    const response = await this.findOrdersUseCase.execute(
      parseInt(page, 10),
      parseInt(limit, 10),
      search,
    );

    return response;
  }

  @Get(':id')
  public async findOrderDetail(
    @Param('id') id: string,
  ): Promise<OrderDetailReadModel> {
    const response = await this.findOrderDetailUseCase.execute(id);

    return response;
  }

  @Patch(':id/status')
  public async updateOrderStatus(
    @Body() request: UpdateOrderStatusRequest,
    @Param('id') id: string,
    @CurrentUser('userId') actorId: string,
  ) {
    await this.updateOrderStatusUseCase.execute(request, id, actorId);
  }

  @Patch(':id/payment-status/paid')
  public async markOrderAsPaid(
    @Param('id') id: string,
    @CurrentUser('userId') actorId: string,
  ): Promise<void> {
    await this.markOrderAsPaidUseCase.execute(id, actorId);
  }
}
