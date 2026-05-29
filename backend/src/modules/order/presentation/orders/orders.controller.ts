import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../../shared/http/guards/jwt-auth.guard';
import { PlaceOrderUseCase } from '../../application/order-use-cases/place-order/place-order.use-case';
import { PlaceOrderRequest } from './requests/place-order.request';
import { CurrentUser } from '../../../../shared/http/decorators/current-user.decorator';
import { FindMyOrdersUseCase } from '../../application/order-use-cases/find-my-orders/find-my-orders.use-case';
import { FindMyOrdersResponse } from '../../application/order-use-cases/find-my-orders/find-my-orders.response';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  public constructor(
    private readonly placeOrderUseCase: PlaceOrderUseCase,
    private readonly findMyOrdersUseCase: FindMyOrdersUseCase,
  ) {}

  @Post()
  public async placeOrder(
    @Body() request: PlaceOrderRequest,
    @CurrentUser('userId') userId: string,
  ): Promise<void> {
    await this.placeOrderUseCase.execute(request, userId);
  }

  @Get('my-orders')
  public async findMyOrders(
    @CurrentUser('userId') userId: string,
  ): Promise<FindMyOrdersResponse> {
    const response: FindMyOrdersResponse =
      await this.findMyOrdersUseCase.execute(userId);

    return response;
  }
}
