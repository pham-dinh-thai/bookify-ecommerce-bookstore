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
import { BookPriceDecreased } from '../../../book-management/domain/events/book-price-decreased.event';
import {
  WISHLIST_NOTIFICATION_CACHE_KEYS,
  WISHLIST_NOTIFICATION_COOLDOWN_MS,
} from './wishlist-notification-cache.constants';

@Injectable()
export class SendPriceDropEmailOnBookPriceDecreasedHandler implements IEventHandler<BookPriceDecreased> {
  private readonly logger = new Logger(
    SendPriceDropEmailOnBookPriceDecreasedHandler.name,
  );

  public constructor(
    @Inject(EMAIL_SENDER_SERVICE)
    private readonly emailSenderService: IEmailSenderService,

    @Inject(WISHLISTS_QUERY_REPOSITORY)
    private readonly wishlistsQueryRepository: IWishlistsQueryRepository,

    @Inject(CACHE_REPOSITORY)
    private readonly cacheRepository: ICacheRepository,
  ) {}

  public async handle(event: BookPriceDecreased): Promise<void> {
    try {
      const users =
        await this.wishlistsQueryRepository.findWishlistUsersByBookId(
          event.bookId,
        );

      for (const user of users) {
        const cacheKey = WISHLIST_NOTIFICATION_CACHE_KEYS.PRICE_DROP(
          event.bookId,
          user.userId,
        );

        const notified = await this.cacheRepository.get(cacheKey);
        if (notified) {
          continue;
        }

        await this.emailSenderService.send({
          to: user.email,
          subject: `Price drop: ${event.title}`,
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
        `Failed to send price drop email for book ${event.bookId}`,
        error instanceof Error ? error.stack : String(error),
      );
    }
  }

  private buildEmailText(
    user: WishlistUserReadModel,
    event: BookPriceDecreased,
  ): string {
    return [
      `Hi ${user.firstName},`,
      '',
      `The book "${event.title}" in your wishlist just dropped in price:`,
      `from ${this.formatVnd(event.oldPrice)} to ${this.formatVnd(event.newPrice)}.`,
      '',
      'Hurry before it is gone!',
      '',
      'Thank you for shopping with Bookify.',
    ].join('\n');
  }

  private formatVnd(value: number): string {
    return `${Number(value || 0).toLocaleString('vi-VN')} VNĐ`;
  }
}
