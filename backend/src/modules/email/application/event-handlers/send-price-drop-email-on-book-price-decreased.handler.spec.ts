import { Logger } from '@nestjs/common';
import { WishlistUserReadModel } from '../../../wishlist/domain/read-models/wishlist-user.read-model';
import { BookPriceDecreased } from '../../../book-management/domain/events/book-price-decreased.event';
import { SendPriceDropEmailOnBookPriceDecreasedHandler } from './send-price-drop-email-on-book-price-decreased.handler';

const priceDropEvent = () =>
  new BookPriceDecreased('book-1', 'Clean Architecture', 500000, 400000);

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
  const handler = new SendPriceDropEmailOnBookPriceDecreasedHandler(
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

describe('SendPriceDropEmailOnBookPriceDecreasedHandler', () => {
  it('sends a price drop email to every user with the book in their wishlist', async () => {
    const {
      handler,
      emailSenderService,
      wishlistsQueryRepository,
      cacheRepository,
    } = buildHandler();
    wishlistsQueryRepository.findWishlistUsersByBookId.mockResolvedValue([
      new WishlistUserReadModel('user-1', 'ann@example.com', 'Ann', 'Tran'),
      new WishlistUserReadModel('user-2', 'binh@example.com', 'Binh', 'Le'),
    ]);

    await handler.handle(priceDropEvent());

    expect(
      wishlistsQueryRepository.findWishlistUsersByBookId,
    ).toHaveBeenCalledWith('book-1');
    expect(emailSenderService.send).toHaveBeenCalledTimes(2);
    expect(emailSenderService.send).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'ann@example.com',
        subject: 'Price drop: Clean Architecture',
      }),
    );
    expect(emailSenderService.send).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'binh@example.com',
        text: 'Hi Binh,\n\nThe book "Clean Architecture" in your wishlist just dropped in price:\nfrom 500.000 VNĐ to 400.000 VNĐ.\n\nHurry before it is gone!\n\nThank you for shopping with Bookify.',
      }),
    );
    expect(cacheRepository.set).toHaveBeenCalledWith(
      'wishlist-notifications:price-drop:book-1:user-1',
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

    await handler.handle(priceDropEvent());

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

    await expect(handler.handle(priceDropEvent())).resolves.toBeUndefined();
    expect(errorSpy).toHaveBeenCalled();
    expect(emailSenderService.send).not.toHaveBeenCalled();

    errorSpy.mockRestore();
  });
});
