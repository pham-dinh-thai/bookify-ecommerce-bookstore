import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../../../../shared/http/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../../../shared/http/guards/jwt-auth.guard';
import { FindUserCartUseCase } from '../../application/cart-use-cases/find-all-user-cart-items/find-user-cart.use-case';
import { CartReadModel } from '../../domain/cart-aggregate/read-models/cart.read-model';
import { AddItemToCartUseCase } from '../../application/cart-use-cases/add-item-to-cart/add-item-to-cart.use-case';
import { AddItemToCartRequest } from './requests/add-item-to-cart.request';
import { RemoveItemFromCartUseCase } from '../../application/cart-use-cases/remove-item-from-cart/remove-item-from-cart.use-case';

@Controller('carts')
@UseGuards(JwtAuthGuard)
export class CartsController {
  public constructor(
    private readonly findUserCartUseCase: FindUserCartUseCase,
    private readonly addItemToCartUseCase: AddItemToCartUseCase,
    private readonly removeItemFromCartUseCase: RemoveItemFromCartUseCase,
  ) {}

  @Get()
  public async findUserCart(
    @CurrentUser('userId') userId: string,
  ): Promise<CartReadModel | null> {
    const cart: CartReadModel | null =
      await this.findUserCartUseCase.execute(userId);

    return cart;
  }

  @Post()
  public async addItem(
    @Body() request: AddItemToCartRequest,
    @CurrentUser('userId') userId: string,
  ): Promise<void> {
    await this.addItemToCartUseCase.execute(request, userId);
  }

  @Delete(':productId')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async removeItem(
    @Param('productId') productId: string,
    @CurrentUser('userId') userId: string,
  ): Promise<void> {
    await this.removeItemFromCartUseCase.execute(productId, userId);
  }
}
