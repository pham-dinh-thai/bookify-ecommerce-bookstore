import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../../../../shared/http/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../../../shared/http/guards/jwt-auth.guard';
import { FindUserCartUseCase } from '../../application/cart-use-cases/find-all-user-cart-items/find-user-cart.use-case';
import { CartReadModel } from '../../domain/cart-aggregate/read-models/cart.read-model';
import { AddItemToCartUseCase } from '../../application/cart-use-cases/add-item-to-cart/add-item-to-cart.use-case';
import { AddItemToCartRequest } from './requests/add-item-to-cart.request';

@Controller('carts')
@UseGuards(JwtAuthGuard)
export class CartsController {
  public constructor(
    private readonly findUserCartUseCase: FindUserCartUseCase,
    private readonly addItemToCartUseCase: AddItemToCartUseCase,
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

  @Delete(':itemId')
  @HttpCode(HttpStatus.NO_CONTENT)
  public removeItem(@CurrentUser('userId') userId: string) {}
}
