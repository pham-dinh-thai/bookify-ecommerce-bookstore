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
import { JwtAuthGuard } from '../../../../shared/http/guards/jwt-auth.guard';
import { FindUserWishlistUseCase } from '../../application/use-cases/find-user-wishlist/find-user-wishlist.use-case';
import { CurrentUser } from '../../../../shared/http/decorators/current-user.decorator';
import { WishlistReadModel } from '../../domain/read-models/wishlist.read-model';
import { AddItemToWishlistRequest } from './requests/add-item-to-wishlist.request';
import { AddItemToWishlistUseCase } from '../../application/use-cases/add-item-to-wishlist/add-item-to-wishlist.use-case';
import { RemoveItemFromWishlistUseCase } from '../../application/use-cases/remove-item-from-wishlist/remove-item-from-wishlist.use-case';

@Controller('wishlists')
@UseGuards(JwtAuthGuard)
export class WishlistsController {
  public constructor(
    private readonly findUserWishlistUseCase: FindUserWishlistUseCase,
    private readonly addItemToWishlistUseCase: AddItemToWishlistUseCase,
    private readonly removeItemFromWishlistUseCase: RemoveItemFromWishlistUseCase,
  ) {}

  @Get()
  public async findUserWishlist(
    @CurrentUser('userId') userId: string,
  ): Promise<WishlistReadModel | null> {
    return await this.findUserWishlistUseCase.execute(userId);
  }

  @Post()
  public async addItemToWishlist(
    @Body() request: AddItemToWishlistRequest,
    @CurrentUser('userId') userId: string,
  ): Promise<void> {
    await this.addItemToWishlistUseCase.execute(userId, request);
  }

  @Delete('/item/:itemId')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async removeItemFromWishlist(
    @Param('itemId') itemId: string,
    @CurrentUser('userId') userId: string,
  ): Promise<void> {
    await this.removeItemFromWishlistUseCase.execute(itemId, userId);
  }
}
