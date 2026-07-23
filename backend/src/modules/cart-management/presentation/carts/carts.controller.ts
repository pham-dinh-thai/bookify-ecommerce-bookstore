import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
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
import { UpdateItemQuantityUseCase } from '../../application/cart-use-cases/update-item-quantity/update-item-quantity.use-case';
import { UpdateItemQuantityRequest } from './requests/update-item-quantity.request';

@Controller('carts')
@UseGuards(JwtAuthGuard)
export class CartsController {
  public constructor(
    private readonly findUserCartUseCase: FindUserCartUseCase,
    private readonly addItemToCartUseCase: AddItemToCartUseCase,
    private readonly removeItemFromCartUseCase: RemoveItemFromCartUseCase,
    private readonly updateItemQuantityUseCase: UpdateItemQuantityUseCase,
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

  @Patch(':productId')
  public async updateItemQuantity(
    @Param('productId') productId: string,
    @Body() request: UpdateItemQuantityRequest,
    @CurrentUser('userId') userId: string,
  ): Promise<void> {
    await this.updateItemQuantityUseCase.execute(
      productId,
      request.quantity,
      userId,
    );
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
