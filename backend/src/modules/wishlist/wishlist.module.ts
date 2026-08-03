import { Module } from '@nestjs/common';
import { WishlistsController } from './presentation/wishlists/wishlists.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WishlistTypeOrm } from './infrastructure/entities/wishlist.entity';
import { WishlistItemTypeOrm } from './infrastructure/entities/wishlist-item.entity';
import { WISHLISTS_QUERY_REPOSITORY } from './domain/repositories/wishlists-query.repository.interface';
import { TypeOrmWishlistQueryRepository } from './infrastructure/repositories/typeorm-wishlists-query.repository';
import { FindUserWishlistUseCase } from './application/use-cases/find-user-wishlist/find-user-wishlist.use-case';
import { UnitOfWorkModule } from '../../shared/modules/unit-of-work/unit-of-work.module';
import { UuidModule } from '../../shared/modules/uuid/uuid.module';
import { AuthenticationModule } from '../authentication/authentication.module';
import { BookTypeOrm } from '../book-management/infrastructure/entities/book.entity';
import { BookCoverTypeOrm } from '../book-management/infrastructure/entities/book-cover.entity';
import { BookAuthorTypeOrm } from '../book-management/infrastructure/entities/book-author.entity';
import { AuthorTypeOrm } from '../catalog-management/infrastructure/entities/author.entity';

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
    {
      provide: WISHLISTS_QUERY_REPOSITORY,
      useClass: TypeOrmWishlistQueryRepository,
    },
  ],
})
export class WishlistModule {}
