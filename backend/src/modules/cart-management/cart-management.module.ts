import { Module } from '@nestjs/common';
import { CartsController } from './presentation/carts/carts.controller';
import { AuthenticationModule } from '../authentication/authentication.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartTypeOrm } from './infrastructure/entities/cart.entity';
import { CartItemTypeOrm } from './infrastructure/entities/cart-item.entity';
import { CARTS_QUERY_REPOSITORY } from './domain/cart-aggregate/repositories/carts-query.repository.interface';
import { TypeOrmCartsQueryRepository } from './infrastructure/repositories/carts/typeorm-carts-query.repository.interface';
import { FindUserCartUseCase } from './application/cart-use-cases/find-all-user-cart-items/find-user-cart.use-case';
import { AddItemToCartUseCase } from './application/cart-use-cases/add-item-to-cart/add-item-to-cart.use-case';
import { UnitOfWorkModule } from '../../shared/modules/unit-of-work/unit-of-work.module';
import { CARTS_COMMAND_REPOSITORY } from './domain/cart-aggregate/repositories/carts-command.repository.interface';
import { TypeOrmCartsCommandRepository } from './infrastructure/repositories/carts/typeorm-carts-command.repository';
import { UuidModule } from '../../shared/modules/uuid/uuid.module';
import { RemoveItemFromCartUseCase } from './application/cart-use-cases/remove-item-from-cart/remove-item-from-cart.use-case';
import { UpdateItemQuantityUseCase } from './application/cart-use-cases/update-item-quantity/update-item-quantity.use-case';
import { BookTypeOrm } from '../book-management/infrastructure/entities/book.entity';
import { BookCoverTypeOrm } from '../book-management/infrastructure/entities/book-cover.entity';
import { BookAuthorTypeOrm } from '../book-management/infrastructure/entities/book-author.entity';
import { AuthorTypeOrm } from '../catalog-management/infrastructure/entities/author.entity';

@Module({
  controllers: [CartsController],
  imports: [
    AuthenticationModule,
    TypeOrmModule.forFeature([
      CartTypeOrm,
      CartItemTypeOrm,
      BookTypeOrm,
      BookCoverTypeOrm,
      BookAuthorTypeOrm,
      AuthorTypeOrm,
    ]),
    UnitOfWorkModule,
    UuidModule,
  ],
  providers: [
    FindUserCartUseCase,
    AddItemToCartUseCase,
    RemoveItemFromCartUseCase,
    UpdateItemQuantityUseCase,
    {
      provide: CARTS_QUERY_REPOSITORY,
      useClass: TypeOrmCartsQueryRepository,
    },
    {
      provide: CARTS_COMMAND_REPOSITORY,
      useClass: TypeOrmCartsCommandRepository,
    },
  ],
})
export class CartManagementModule {}
