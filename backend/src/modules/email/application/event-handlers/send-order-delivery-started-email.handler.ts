import { Inject, Injectable, Logger } from '@nestjs/common';
import { IEventHandler } from '../../../../shared/domain/event-handler.interface';
import { OrderDeliveryStarted } from '../../../order/domain/order-aggregate/events/order-delivery-started.event';
import {
  EMAIL_SENDER_SERVICE,
  type IEmailSenderService,
} from '../../domain/email-aggregate/services/email-sender.service';

@Injectable()
export class SendOrderDeliveryStartedEmailHandler implements IEventHandler<OrderDeliveryStarted> {
  private readonly logger = new Logger(
    SendOrderDeliveryStartedEmailHandler.name,
  );

  public constructor(
    @Inject(EMAIL_SENDER_SERVICE)
    private readonly emailSenderService: IEmailSenderService,
  ) {}

  public async handle(event: OrderDeliveryStarted): Promise<void> {
    try {
      await this.emailSenderService.send({
        to: event.customerEmail,
        subject: `Bookify order ${event.orderCode} is out for delivery`,
        text: [
          `Hi ${event.customerName},`,
          '',
          `Your Bookify order ${event.orderCode} is now out for delivery.`,
          'Please keep your phone available so the delivery team can contact you.',
          '',
          'Thank you for shopping with Bookify.',
        ].join('\n'),
      });
    } catch (error) {
      this.logger.error(
        `Failed to send delivery started email for ${event.orderId}`,
        error instanceof Error ? error.stack : String(error),
      );
    }
  }
}
