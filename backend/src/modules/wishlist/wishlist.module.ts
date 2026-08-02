import { Module } from '@nestjs/common';
import { WishlistsController } from './presentation/wishlists/wishlists.controller';

@Module({
  controllers: [WishlistsController],
})
export class WishlistModule {}
