import { Module } from '@nestjs/common';
import { CartsController } from './presentation/carts/carts.controller';

@Module({
  controllers: [CartsController]
})
export class CartManagementModule {}
