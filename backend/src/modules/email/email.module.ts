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
import { EVENT_DISPATCHER } from '../../shared/domain/event-dispatcher.interface';
import { type IEventDispatcher } from '../../shared/domain/event-dispatcher.interface';
import { UserRegistered } from '../authentication/domain/authenticable-user-aggregate/events/user-registered.event';
import { OrderPlaced } from '../order/domain/order-aggregate/events/order-placed.event';
import { OrderConfirmed } from '../order/domain/order-aggregate/events/order-confirmed.event';
import { OrderDeliveryStarted } from '../order/domain/order-aggregate/events/order-delivery-started.event';
import { OrderDelivered } from '../order/domain/order-aggregate/events/order-delivered.event';
import { OrderCompleted } from '../order/domain/order-aggregate/events/order-completed.event';
import { EventDispatcherModule } from '../../shared/modules/event-dispatcher/event-dispatcher.module';
import { SharedCacheModule } from '../../shared/modules/cache/cache.module';
import { VerifyEmailUseCase } from './application/use-cases/verify-email.use-case';
import { AuthenticationModule } from '../authentication/authentication.module';

@Module({
  imports: [EventDispatcherModule, SharedCacheModule, AuthenticationModule],
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
  }
}
