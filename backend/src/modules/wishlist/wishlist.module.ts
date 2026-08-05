import { Module } from '@nestjs/common';
import { WishlistsController } from './presentation/wishlists/wishlists.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WishlistTypeOrm } from './infrastructure/entities/wishlist.entity';
import { WishlistItemTypeOrm } from './infrastructure/entities/wishlist-item.entity';
import { WISHLISTS_QUERY_REPOSITORY } from './domain/repositories/wishlists-query.repository.interface';
import { WISHLISTS_COMMAND_REPOSITORY } from './domain/repositories/wishlists-command.repository.interface';
import { TypeOrmWishlistsQueryRepository } from './infrastructure/repositories/typeorm-wishlists-query.repository';
import { TypeOrmWishlistsCommandRepository } from './infrastructure/repositories/typeorm-wishlists-command.repository';
import { FindUserWishlistUseCase } from './application/use-cases/find-user-wishlist/find-user-wishlist.use-case';
import { UnitOfWorkModule } from '../../shared/modules/unit-of-work/unit-of-work.module';
import { UuidModule } from '../../shared/modules/uuid/uuid.module';
import { AuthenticationModule } from '../authentication/authentication.module';
import { BookTypeOrm } from '../book-management/infrastructure/entities/book.entity';
import { BookCoverTypeOrm } from '../book-management/infrastructure/entities/book-cover.entity';
import { BookAuthorTypeOrm } from '../book-management/infrastructure/entities/book-author.entity';
import { AuthorTypeOrm } from '../catalog-management/infrastructure/entities/author.entity';
import { AddItemToWishlistUseCase } from './application/use-cases/add-item-to-wishlist/add-item-to-wishlist.use-case';
import { RemoveItemFromWishlistUseCase } from './application/use-cases/remove-item-from-wishlist/remove-item-from-wishlist.use-case';

@Module({
  imports: [
    AuthenticationModule,
    TypeOrmModule.forFeature([
      WishlistTypeOrm,
      WishlistItemTypeOrm,
      BookTypeOrm,
      BookCoverTypeOrm,
      BookAuthorTypeOrm,
      AuthorTypeOrm,
    ]),
    UnitOfWorkModule,
    UuidModule,
  ],
  controllers: [WishlistsController],
  providers: [
    FindUserWishlistUseCase,
    AddItemToWishlistUseCase,
    RemoveItemFromWishlistUseCase,
    {
      provide: WISHLISTS_QUERY_REPOSITORY,
      useClass: TypeOrmWishlistsQueryRepository,
    },
    {
      provide: WISHLISTS_COMMAND_REPOSITORY,
      useClass: TypeOrmWishlistsCommandRepository,
    },
  ],
})
export class WishlistModule {}
