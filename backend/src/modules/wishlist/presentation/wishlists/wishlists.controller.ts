import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../../shared/http/guards/jwt-auth.guard';
import { FindUserWishlistUseCase } from '../../application/use-cases/find-user-wishlist/find-user-wishlist.use-case';
import { FindUserWishlistRequest } from '../../application/use-cases/find-user-wishlist/find-user-wishlist.request';
import { CurrentUser } from '../../../../shared/http/decorators/current-user.decorator';
import { WishlistReadModel } from '../../domain/read-models/wishlist.read-model';

@Controller('wishlists')
@UseGuards(JwtAuthGuard)
export class WishlistsController {
  public constructor(
    private readonly findUserWishlistUseCase: FindUserWishlistUseCase,
  ) {}

  @Get()
  public async findUserWishlist(
    @CurrentUser('userId') userId: string,
  ): Promise<WishlistReadModel | null> {
    return this.findUserWishlistUseCase.execute(
      new FindUserWishlistRequest(userId),
    );
  }
}
