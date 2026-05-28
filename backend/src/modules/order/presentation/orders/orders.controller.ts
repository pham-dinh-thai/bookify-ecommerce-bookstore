import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../../shared/http/guards/jwt-auth.guard';
import { PlaceOrderUseCase } from '../../application/order-use-cases/place-order/place-order.use-case';
import { PlaceOrderRequest } from './requests/place-order.request';
import { CurrentUser } from '../../../../shared/http/decorators/current-user.decorator';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  public constructor(private readonly placeOrderUseCase: PlaceOrderUseCase) {}

  @Post()
  public async placeOrder(
    @Body() request: PlaceOrderRequest,
    @CurrentUser('userId') userId: string,
  ): Promise<any> {
    return await this.placeOrderUseCase.execute(request, userId);
  }
}
