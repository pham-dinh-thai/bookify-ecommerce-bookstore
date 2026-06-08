import { Inject, Injectable, Logger } from '@nestjs/common';
import { IEventHandler } from '../../../../shared/domain/event-handler.interface';
import { OrderCanceled } from '../../../order/domain/order-aggregate/events/order-canceled.event';
import {
  EMAIL_SENDER_SERVICE,
  type IEmailSenderService,
} from '../../domain/email-aggregate/services/email-sender.service';

@Injectable()
export class SendOrderCanceledEmailHandler implements IEventHandler<OrderCanceled> {
  private readonly logger = new Logger(SendOrderCanceledEmailHandler.name);

  public constructor(
    @Inject(EMAIL_SENDER_SERVICE)
    private readonly emailSenderService: IEmailSenderService,
  ) {}

  public async handle(event: OrderCanceled): Promise<void> {
    try {
      await this.emailSenderService.send({
        to: event.customerEmail,
        subject: `Bookify order ${event.orderCode} has been canceled`,
        text: [
          `Hi ${event.customerName},`,
          '',
          `Your Bookify order ${event.orderCode} has been canceled.`,
          'The reserved books have been returned to stock.',
          '',
          'Thank you for shopping with Bookify.',
        ].join('\n'),
      });
    } catch (error) {
      this.logger.error(
        `Failed to send order canceled email for ${event.orderId}`,
        error instanceof Error ? error.stack : String(error),
      );
    }
  }
}
