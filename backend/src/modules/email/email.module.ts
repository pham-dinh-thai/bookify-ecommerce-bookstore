import { Inject, Module, OnModuleInit } from '@nestjs/common';
import { EmailController } from './presentation/email/email.controller';
import { EMAIL_SENDER_SERVICE } from './domain/email-aggregate/services/email-sender.service';
import { EmailSenderService } from './infrastructure/services/email-sender.service';
import { SendVerificationEmailOnUserRegisteredHandler } from './application/event-handlers/send-verification-email-on-user-registered.handler';
import { SendOrderConfirmationEmailOnOrderPlacedHandler } from './application/event-handlers/send-order-confirmation-email-on-order-placed.handler';
import { EVENT_DISPATCHER } from '../../shared/domain/event-dispatcher.interface';
import { type IEventDispatcher } from '../../shared/domain/event-dispatcher.interface';
import { UserRegistered } from '../authentication/domain/authenticable-user-aggregate/events/user-registered.event';
import { OrderPlaced } from '../order/domain/order-aggregate/events/order-placed.event';
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
    VerifyEmailUseCase,
  ],
})
export class EmailModule implements OnModuleInit {
  constructor(
    @Inject(EVENT_DISPATCHER)
    private readonly eventDispatcher: IEventDispatcher,
    private readonly verificationEmailHandler: SendVerificationEmailOnUserRegisteredHandler,
    private readonly orderConfirmationEmailHandler: SendOrderConfirmationEmailOnOrderPlacedHandler,
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
  }
}
