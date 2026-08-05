import { Test, TestingModule } from '@nestjs/testing';
import { WishlistsController } from './wishlists.controller';
import { FindUserWishlistUseCase } from '../../application/use-cases/find-user-wishlist/find-user-wishlist.use-case';
import { AddItemToWishlistUseCase } from '../../application/use-cases/add-item-to-wishlist/add-item-to-wishlist.use-case';

describe('WishlistsController', () => {
  let controller: WishlistsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WishlistsController],
      providers: [
        {
          provide: FindUserWishlistUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: AddItemToWishlistUseCase,
          useValue: { execute: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<WishlistsController>(WishlistsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
