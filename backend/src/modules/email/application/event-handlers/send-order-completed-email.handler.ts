import { Inject, Injectable, Logger } from '@nestjs/common';
import { IEventHandler } from '../../../../shared/domain/event-handler.interface';
import { OrderCompleted } from '../../../order/domain/order-aggregate/events/order-completed.event';
import {
  EMAIL_SENDER_SERVICE,
  type IEmailSenderService,
} from '../../domain/email-aggregate/services/email-sender.service';

@Injectable()
export class SendOrderCompletedEmailHandler implements IEventHandler<OrderCompleted> {
  private readonly logger = new Logger(SendOrderCompletedEmailHandler.name);

  public constructor(
    @Inject(EMAIL_SENDER_SERVICE)
    private readonly emailSenderService: IEmailSenderService,
  ) {}

  public async handle(event: OrderCompleted): Promise<void> {
    try {
      await this.emailSenderService.send({
        to: event.customerEmail,
        subject: `Bookify order ${event.orderCode} is completed`,
        text: [
          `Hi ${event.customerName},`,
          '',
          `Your Bookify order ${event.orderCode} is now completed.`,
          'We hope you enjoy your new books.',
          '',
          'Thank you for shopping with Bookify.',
        ].join('\n'),
      });
    } catch (error) {
      this.logger.error(
        `Failed to send order completed email for ${event.orderId}`,
        error instanceof Error ? error.stack : String(error),
      );
    }
  }
}
