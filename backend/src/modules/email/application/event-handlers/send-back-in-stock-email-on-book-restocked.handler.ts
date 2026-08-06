import { Inject, Injectable, Logger } from '@nestjs/common';
import { IEventHandler } from '../../../../shared/domain/event-handler.interface';
import {
  CACHE_REPOSITORY,
  type ICacheRepository,
} from '../../../../shared/modules/cache/domain/cache.repository.interface';
import {
  EMAIL_SENDER_SERVICE,
  type IEmailSenderService,
} from '../../domain/email-aggregate/services/email-sender.service';
import {
  WISHLISTS_QUERY_REPOSITORY,
  type IWishlistsQueryRepository,
} from '../../../wishlist/domain/repositories/wishlists-query.repository.interface';
import { WishlistUserReadModel } from '../../../wishlist/domain/read-models/wishlist-user.read-model';
import { BookRestocked } from '../../../book-management/domain/events/book-restocked.event';
import {
  WISHLIST_NOTIFICATION_CACHE_KEYS,
  WISHLIST_NOTIFICATION_COOLDOWN_MS,
} from './wishlist-notification-cache.constants';

@Injectable()
export class SendBackInStockEmailOnBookRestockedHandler implements IEventHandler<BookRestocked> {
  private readonly logger = new Logger(
    SendBackInStockEmailOnBookRestockedHandler.name,
  );

  public constructor(
    @Inject(EMAIL_SENDER_SERVICE)
    private readonly emailSenderService: IEmailSenderService,

    @Inject(WISHLISTS_QUERY_REPOSITORY)
    private readonly wishlistsQueryRepository: IWishlistsQueryRepository,

    @Inject(CACHE_REPOSITORY)
    private readonly cacheRepository: ICacheRepository,
  ) {}

  public async handle(event: BookRestocked): Promise<void> {
    try {
      const users =
        await this.wishlistsQueryRepository.findWishlistUsersByBookId(
          event.bookId,
        );

      for (const user of users) {
        const cacheKey = WISHLIST_NOTIFICATION_CACHE_KEYS.RESTOCK(
          event.bookId,
          user.userId,
        );

        const notified = await this.cacheRepository.get(cacheKey);
        if (notified) {
          continue;
        }

        await this.emailSenderService.send({
          to: user.email,
          subject: `Back in stock: ${event.title}`,
          text: this.buildEmailText(user, event),
        });

        await this.cacheRepository.set(
          cacheKey,
          true,
          WISHLIST_NOTIFICATION_COOLDOWN_MS,
        );
      }
    } catch (error) {
      this.logger.error(
        `Failed to send back-in-stock email for book ${event.bookId}`,
        error instanceof Error ? error.stack : String(error),
      );
    }
  }

  private buildEmailText(
    user: WishlistUserReadModel,
    event: BookRestocked,
  ): string {
    return [
      `Hi ${user.firstName},`,
      '',
      `The book "${event.title}" in your wishlist is back in stock.`,
      '',
      'Thank you for shopping with Bookify.',
    ].join('\n');
  }
}
