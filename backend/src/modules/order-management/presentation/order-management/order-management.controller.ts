import { Body, Controller, Param, Patch, UseGuards } from '@nestjs/common';
import { UpdateOrderStatusUseCase } from '../../application/order-management-use-cases/update-order-status/update-order-status.use-case';
import { JwtAuthGuard } from '../../../../shared/http/guards/jwt-auth.guard';
import { RoleGuard } from '../../../../shared/http/guards/role.guard';
import { Roles } from '../../../../shared/http/decorators/roles.decorator';
import { UpdateOrderStatusRequest } from './requests/update-order-status.request';
import { CurrentUser } from '../../../../shared/http/decorators/current-user.decorator';

@Controller('orders')
@UseGuards(JwtAuthGuard, RoleGuard)
@Roles('admin', 'staff')
export class OrderManagementController {
  public constructor(
    private readonly updateOrderStatusUseCase: UpdateOrderStatusUseCase,
  ) {}

  @Patch(':id/status')
  public async updateOrderStatus(
    @Body() request: UpdateOrderStatusRequest,
    @Param('id') id: string,
    @CurrentUser('userId') actorId: string,
  ) {
    await this.updateOrderStatusUseCase.execute(request, id, actorId);
  }
}
