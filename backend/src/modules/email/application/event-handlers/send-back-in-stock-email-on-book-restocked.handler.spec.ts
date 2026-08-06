import { Logger } from '@nestjs/common';
import { WishlistUserReadModel } from '../../../wishlist/domain/read-models/wishlist-user.read-model';
import { BookRestocked } from '../../../book-management/domain/events/book-restocked.event';
import { SendBackInStockEmailOnBookRestockedHandler } from './send-back-in-stock-email-on-book-restocked.handler';

const restockedEvent = () =>
  new BookRestocked('book-1', 'Clean Architecture', 10);

const buildHandler = () => {
  const emailSenderService = { send: jest.fn().mockResolvedValue(undefined) };
  const wishlistsQueryRepository = {
    findUserWishlist: jest.fn().mockResolvedValue(null),
    findWishlistUsersByBookId: jest.fn().mockResolvedValue([]),
  };
  const cacheRepository = {
    get: jest.fn().mockResolvedValue(null),
    set: jest.fn().mockResolvedValue(undefined),
    del: jest.fn(),
    delByPattern: jest.fn(),
  };
  const handler = new SendBackInStockEmailOnBookRestockedHandler(
    emailSenderService,
    wishlistsQueryRepository,
    cacheRepository,
  );

  return {
    handler,
    emailSenderService,
    wishlistsQueryRepository,
    cacheRepository,
  };
};

describe('SendBackInStockEmailOnBookRestockedHandler', () => {
  it('sends a back-in-stock email to every user with the book in their wishlist', async () => {
    const {
      handler,
      emailSenderService,
      wishlistsQueryRepository,
      cacheRepository,
    } = buildHandler();
    wishlistsQueryRepository.findWishlistUsersByBookId.mockResolvedValue([
      new WishlistUserReadModel('user-1', 'ann@example.com', 'Ann', 'Tran'),
    ]);

    await handler.handle(restockedEvent());

    expect(
      wishlistsQueryRepository.findWishlistUsersByBookId,
    ).toHaveBeenCalledWith('book-1');
    expect(emailSenderService.send).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'ann@example.com',
        subject: 'Back in stock: Clean Architecture',
        text: 'Hi Ann,\n\nThe book "Clean Architecture" in your wishlist is back in stock.\n\nThank you for shopping with Bookify.',
      }),
    );
    expect(cacheRepository.set).toHaveBeenCalledWith(
      'wishlist-notifications:restock:book-1:user-1',
      true,
      7 * 24 * 60 * 60 * 1000,
    );
  });

  it('skips users who were already notified within the cooldown window', async () => {
    const {
      handler,
      emailSenderService,
      wishlistsQueryRepository,
      cacheRepository,
    } = buildHandler();
    wishlistsQueryRepository.findWishlistUsersByBookId.mockResolvedValue([
      new WishlistUserReadModel('user-1', 'ann@example.com', 'Ann', 'Tran'),
    ]);
    cacheRepository.get.mockResolvedValue(true);

    await handler.handle(restockedEvent());

    expect(emailSenderService.send).not.toHaveBeenCalled();
    expect(cacheRepository.set).not.toHaveBeenCalled();
  });

  it('logs the error and does not rethrow when the lookup fails', async () => {
    const errorSpy = jest
      .spyOn(Logger.prototype, 'error')
      .mockImplementation(() => undefined);
    const { handler, emailSenderService, wishlistsQueryRepository } =
      buildHandler();
    wishlistsQueryRepository.findWishlistUsersByBookId.mockRejectedValue(
      new Error('db down'),
    );

    await expect(handler.handle(restockedEvent())).resolves.toBeUndefined();
    expect(errorSpy).toHaveBeenCalled();
    expect(emailSenderService.send).not.toHaveBeenCalled();

    errorSpy.mockRestore();
  });
});
