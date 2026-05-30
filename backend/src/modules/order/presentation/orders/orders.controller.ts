import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../../shared/http/guards/jwt-auth.guard';
import { PlaceOrderUseCase } from '../../application/order-use-cases/place-order/place-order.use-case';
import { PlaceOrderRequest } from './requests/place-order.request';
import { CurrentUser } from '../../../../shared/http/decorators/current-user.decorator';
import { FindMyOrdersUseCase } from '../../application/order-use-cases/find-my-orders/find-my-orders.use-case';
import { FindMyOrdersResponse } from '../../application/order-use-cases/find-my-orders/find-my-orders.response';
import { CancelOrderUseCase } from '../../application/order-use-cases/cancel-order/cancel-order.use-case';
import { OrderDetailReadModel } from '../../domain/order-aggregate/read-models/order-detail.read-model';
import { ViewOrderDetailUseCase } from '../../application/order-use-cases/view-order-detail/view-order-detail.use-case';

@Controller('my-orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  public constructor(
    private readonly placeOrderUseCase: PlaceOrderUseCase,
    private readonly findMyOrdersUseCase: FindMyOrdersUseCase,
    private readonly cancelOrderUseCase: CancelOrderUseCase,
    private readonly viewOrderDetailUseCase: ViewOrderDetailUseCase,
  ) {}

  @Get()
  public async findMyOrders(
    @CurrentUser('userId') userId: string,
  ): Promise<FindMyOrdersResponse> {
    const response: FindMyOrdersResponse =
      await this.findMyOrdersUseCase.execute(userId);

    return response;
  }

  @Get(':id')
  public async viewDetail(
    @Param('id') id: string,
    @CurrentUser('userId') userId: string,
  ): Promise<OrderDetailReadModel> {
    const response = this.viewOrderDetailUseCase.execute(id, userId);

    return response;
  }

  @Post()
  public async placeOrder(
    @Body() request: PlaceOrderRequest,
    @CurrentUser('userId') userId: string,
  ): Promise<void> {
    await this.placeOrderUseCase.execute(request, userId);
  }

  @Patch(':id/cancel')
  public async cancelOrder(
    @Param('id') id: string,
    @CurrentUser('userId') userId: string,
  ): Promise<void> {
    await this.cancelOrderUseCase.execute(id, userId);
  }
}
