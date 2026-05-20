import { Module } from '@nestjs/common';
import { CartsController } from './presentation/carts/carts.controller';
import { AuthenticationModule } from '../authentication/authentication.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartTypeOrm } from './infrastructure/entities/cart.entity';
import { CartItemTypeOrm } from './infrastructure/entities/cart-item.entity';
import { CARTS_QUERY_REPOSITORY } from './domain/cart-aggregate/repositories/carts-query.repository.interface';
import { TypeOrmCartsQueryRepository } from './infrastructure/repositories/carts/typeorm-carts-query.repository.interface';
import { FindUserCartUseCase } from './application/cart-use-cases/find-all-user-cart-items/find-user-cart.use-case';

@Module({
  controllers: [CartsController],
  imports: [
    AuthenticationModule,
    TypeOrmModule.forFeature([CartTypeOrm, CartItemTypeOrm]),
  ],
  providers: [
    FindUserCartUseCase,
    {
      provide: CARTS_QUERY_REPOSITORY,
      useClass: TypeOrmCartsQueryRepository,
    },
  ],
})
export class CartManagementModule {}
