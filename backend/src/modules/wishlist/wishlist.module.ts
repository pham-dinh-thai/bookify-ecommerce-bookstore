import { Module } from '@nestjs/common';
import { WishlistController } from './presentation/wishlist/wishlist.controller';

@Module({
  controllers: [WishlistController]
})
export class WishlistModule {}
