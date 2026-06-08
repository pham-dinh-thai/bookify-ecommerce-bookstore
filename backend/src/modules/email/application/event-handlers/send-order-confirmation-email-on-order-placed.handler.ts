import { Inject, Injectable, Logger } from '@nestjs/common';
import { IEventHandler } from '../../../../shared/domain/event-handler.interface';
import { OrderPlaced } from '../../../order/domain/order-aggregate/events/order-placed.event';
import {
  EMAIL_SENDER_SERVICE,
  type IEmailSenderService,
} from '../../domain/email-aggregate/services/email-sender.service';

@Injectable()
export class SendOrderConfirmationEmailOnOrderPlacedHandler implements IEventHandler<OrderPlaced> {
  private readonly logger = new Logger(
    SendOrderConfirmationEmailOnOrderPlacedHandler.name,
  );

  public constructor(
    @Inject(EMAIL_SENDER_SERVICE)
    private readonly emailSenderService: IEmailSenderService,
  ) {}

  public async handle(event: OrderPlaced): Promise<void> {
    try {
      await this.emailSenderService.send({
        to: event.customerEmail,
        subject: `Bookify order ${event.orderCode} has been placed`,
        text: this.buildEmailText(event),
      });
    } catch (error) {
      this.logger.error(
        `Failed to send order confirmation email for ${event.orderId}`,
        error instanceof Error ? error.stack : String(error),
      );
    }
  }

  private buildEmailText(event: OrderPlaced): string {
    const items = event.items
      .map(
        (item) =>
          `- ${item.title} x ${item.quantity}: ${this.formatVnd(item.lineTotal)}`,
      )
      .join('\n');

    return [
      `Hi ${event.customerName},`,
      '',
      `Your Bookify order ${event.orderCode} has been placed successfully.`,
      '',
      'Order summary:',
      items,
      '',
      `Total: ${this.formatVnd(event.totalAmount)}`,
      `Payment method: ${this.formatPaymentMethod(event.paymentMethod)}`,
      `Payment status: ${event.paymentStatus}`,
      `Shipping address: ${event.shippingAddress}`,
      `Phone number: ${event.phoneNumber}`,
      '',
      'Thank you for shopping with Bookify.',
    ].join('\n');
  }

  private formatVnd(value: number): string {
    return `${Number(value || 0).toLocaleString('vi-VN')} VNĐ`;
  }

  private formatPaymentMethod(paymentMethod: string): string {
    return paymentMethod
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}
