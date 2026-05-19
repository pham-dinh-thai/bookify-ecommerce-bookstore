import { Module } from '@nestjs/common';
import { CartsController } from './presentation/carts/carts.controller';
import { AuthenticationModule } from '../authentication/authentication.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartTypeOrm } from './infrastructure/entities/cart.entity';
import { CartItemTypeOrm } from './infrastructure/entities/cart-item.entity';

@Module({
  controllers: [CartsController],
  imports: [
    AuthenticationModule,
    TypeOrmModule.forFeature([CartTypeOrm, CartItemTypeOrm]),
  ],
})
export class CartManagementModule {}
