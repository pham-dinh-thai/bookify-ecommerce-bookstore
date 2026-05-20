import {
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

@Controller('carts')
@UseGuards(JwtAuthGuard)
export class CartsController {
  public constructor(
    private readonly findUserCartUseCase: FindUserCartUseCase,
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
  public addItem(@CurrentUser('userId') userId: string) {}

  @Delete(':itemId')
  @HttpCode(HttpStatus.NO_CONTENT)
  public removeItem(@CurrentUser('userId') userId: string) {}
}
