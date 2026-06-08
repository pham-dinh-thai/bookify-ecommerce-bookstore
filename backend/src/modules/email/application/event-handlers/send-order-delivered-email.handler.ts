import { Inject, Injectable, Logger } from '@nestjs/common';
import { IEventHandler } from '../../../../shared/domain/event-handler.interface';
import { OrderDelivered } from '../../../order/domain/order-aggregate/events/order-delivered.event';
import {
  EMAIL_SENDER_SERVICE,
  type IEmailSenderService,
} from '../../domain/email-aggregate/services/email-sender.service';

@Injectable()
export class SendOrderDeliveredEmailHandler implements IEventHandler<OrderDelivered> {
  private readonly logger = new Logger(SendOrderDeliveredEmailHandler.name);

  public constructor(
    @Inject(EMAIL_SENDER_SERVICE)
    private readonly emailSenderService: IEmailSenderService,
  ) {}

  public async handle(event: OrderDelivered): Promise<void> {
    try {
      await this.emailSenderService.send({
        to: event.customerEmail,
        subject: `Bookify order ${event.orderCode} has been delivered`,
        text: [
          `Hi ${event.customerName},`,
          '',
          `Your Bookify order ${event.orderCode} has been delivered.`,
          'Please check your books and contact Bookify if anything needs support.',
          '',
          'Thank you for shopping with Bookify.',
        ].join('\n'),
      });
    } catch (error) {
      this.logger.error(
        `Failed to send order delivered email for ${event.orderId}`,
        error instanceof Error ? error.stack : String(error),
      );
    }
  }
}
