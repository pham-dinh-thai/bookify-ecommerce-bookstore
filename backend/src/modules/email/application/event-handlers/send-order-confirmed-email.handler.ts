import { Inject, Injectable, Logger } from '@nestjs/common';
import { IEventHandler } from '../../../../shared/domain/event-handler.interface';
import { OrderConfirmed } from '../../../order/domain/order-aggregate/events/order-confirmed.event';
import {
  EMAIL_SENDER_SERVICE,
  type IEmailSenderService,
} from '../../domain/email-aggregate/services/email-sender.service';

@Injectable()
export class SendOrderConfirmedEmailHandler implements IEventHandler<OrderConfirmed> {
  private readonly logger = new Logger(SendOrderConfirmedEmailHandler.name);

  public constructor(
    @Inject(EMAIL_SENDER_SERVICE)
    private readonly emailSenderService: IEmailSenderService,
  ) {}

  public async handle(event: OrderConfirmed): Promise<void> {
    try {
      await this.emailSenderService.send({
        to: event.customerEmail,
        subject: `Bookify order ${event.orderCode} has been confirmed`,
        text: [
          `Hi ${event.customerName},`,
          '',
          `Your Bookify order ${event.orderCode} has been confirmed.`,
          'Our staff is preparing your books for delivery.',
          '',
          'Thank you for shopping with Bookify.',
        ].join('\n'),
      });
    } catch (error) {
      this.logger.error(
        `Failed to send order confirmed email for ${event.orderId}`,
        error instanceof Error ? error.stack : String(error),
      );
    }
  }
}
