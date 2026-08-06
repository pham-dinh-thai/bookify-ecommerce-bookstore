import { Inject, Module, OnModuleInit } from '@nestjs/common';
import { EmailController } from './presentation/email/email.controller';
import { EMAIL_SENDER_SERVICE } from './domain/email-aggregate/services/email-sender.service';
import { EmailSenderService } from './infrastructure/services/email-sender.service';
import { SendVerificationEmailOnUserRegisteredHandler } from './application/event-handlers/send-verification-email-on-user-registered.handler';
import { SendOrderConfirmationEmailOnOrderPlacedHandler } from './application/event-handlers/send-order-confirmation-email-on-order-placed.handler';
import { SendOrderConfirmedEmailHandler } from './application/event-handlers/send-order-confirmed-email.handler';
import { SendOrderDeliveryStartedEmailHandler } from './application/event-handlers/send-order-delivery-started-email.handler';
import { SendOrderDeliveredEmailHandler } from './application/event-handlers/send-order-delivered-email.handler';
import { SendOrderCompletedEmailHandler } from './application/event-handlers/send-order-completed-email.handler';
import { SendOrderCanceledEmailHandler } from './application/event-handlers/send-order-canceled-email.handler';
import { SendPriceDropEmailOnBookPriceDecreasedHandler } from './application/event-handlers/send-price-drop-email-on-book-price-decreased.handler';
import { SendBackInStockEmailOnBookRestockedHandler } from './application/event-handlers/send-back-in-stock-email-on-book-restocked.handler';
import { SendDiscountEmailOnBookDiscountUpdatedHandler } from './application/event-handlers/send-discount-email-on-book-discount-updated.handler';
import { EVENT_DISPATCHER } from '../../shared/domain/event-dispatcher.interface';
import { type IEventDispatcher } from '../../shared/domain/event-dispatcher.interface';
import { UserRegistered } from '../authentication/domain/authenticable-user-aggregate/events/user-registered.event';
import { OrderPlaced } from '../order/domain/order-aggregate/events/order-placed.event';
import { OrderConfirmed } from '../order/domain/order-aggregate/events/order-confirmed.event';
import { OrderDeliveryStarted } from '../order/domain/order-aggregate/events/order-delivery-started.event';
import { OrderDelivered } from '../order/domain/order-aggregate/events/order-delivered.event';
import { OrderCompleted } from '../order/domain/order-aggregate/events/order-completed.event';
import { OrderCanceled } from '../order/domain/order-aggregate/events/order-canceled.event';
import { BookPriceDecreased } from '../book-management/domain/events/book-price-decreased.event';
import { BookRestocked } from '../book-management/domain/events/book-restocked.event';
import { BookDiscountUpdated } from '../book-management/domain/events/book-discount-updated.event';
import { EventDispatcherModule } from '../../shared/modules/event-dispatcher/event-dispatcher.module';
import { SharedCacheModule } from '../../shared/modules/cache/cache.module';
import { VerifyEmailUseCase } from './application/use-cases/verify-email.use-case';
import { AuthenticationModule } from '../authentication/authentication.module';
import { WishlistModule } from '../wishlist/wishlist.module';

@Module({
  imports: [
    EventDispatcherModule,
    SharedCacheModule,
    AuthenticationModule,
    WishlistModule,
  ],
  controllers: [EmailController],
  providers: [
    {
      provide: EMAIL_SENDER_SERVICE,
      useClass: EmailSenderService,
    },
    SendVerificationEmailOnUserRegisteredHandler,
    SendOrderConfirmationEmailOnOrderPlacedHandler,
    SendOrderConfirmedEmailHandler,
    SendOrderDeliveryStartedEmailHandler,
    SendOrderDeliveredEmailHandler,
    SendOrderCompletedEmailHandler,
    SendOrderCanceledEmailHandler,
    SendPriceDropEmailOnBookPriceDecreasedHandler,
    SendBackInStockEmailOnBookRestockedHandler,
    SendDiscountEmailOnBookDiscountUpdatedHandler,
    VerifyEmailUseCase,
  ],
})
export class EmailModule implements OnModuleInit {
  constructor(
    @Inject(EVENT_DISPATCHER)
    private readonly eventDispatcher: IEventDispatcher,
    private readonly verificationEmailHandler: SendVerificationEmailOnUserRegisteredHandler,
    private readonly orderConfirmationEmailHandler: SendOrderConfirmationEmailOnOrderPlacedHandler,
    private readonly orderConfirmedEmailHandler: SendOrderConfirmedEmailHandler,
    private readonly orderDeliveryStartedEmailHandler: SendOrderDeliveryStartedEmailHandler,
    private readonly orderDeliveredEmailHandler: SendOrderDeliveredEmailHandler,
    private readonly orderCompletedEmailHandler: SendOrderCompletedEmailHandler,
    private readonly orderCanceledEmailHandler: SendOrderCanceledEmailHandler,
    private readonly priceDropEmailHandler: SendPriceDropEmailOnBookPriceDecreasedHandler,
    private readonly backInStockEmailHandler: SendBackInStockEmailOnBookRestockedHandler,
    private readonly discountEmailHandler: SendDiscountEmailOnBookDiscountUpdatedHandler,
  ) {}

  onModuleInit() {
    this.eventDispatcher.register(
      UserRegistered.name,
      this.verificationEmailHandler,
    );
    this.eventDispatcher.register(
      OrderPlaced.name,
      this.orderConfirmationEmailHandler,
    );
    this.eventDispatcher.register(
      OrderConfirmed.name,
      this.orderConfirmedEmailHandler,
    );
    this.eventDispatcher.register(
      OrderDeliveryStarted.name,
      this.orderDeliveryStartedEmailHandler,
    );
    this.eventDispatcher.register(
      OrderDelivered.name,
      this.orderDeliveredEmailHandler,
    );
    this.eventDispatcher.register(
      OrderCompleted.name,
      this.orderCompletedEmailHandler,
    );
    this.eventDispatcher.register(
      OrderCanceled.name,
      this.orderCanceledEmailHandler,
    );
    this.eventDispatcher.register(
      BookPriceDecreased.name,
      this.priceDropEmailHandler,
    );
    this.eventDispatcher.register(
      BookRestocked.name,
      this.backInStockEmailHandler,
    );
    this.eventDispatcher.register(
      BookDiscountUpdated.name,
      this.discountEmailHandler,
    );
  }
}
