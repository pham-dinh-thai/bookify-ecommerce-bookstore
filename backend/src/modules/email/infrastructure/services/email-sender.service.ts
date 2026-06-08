import { type ErrorResponse, Resend } from 'resend';
import { IEmailSenderService } from '../../domain/email-aggregate/services/email-sender.service';
import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import { SendEmailProps } from '../../domain/email-aggregate/types';
import { InternalServerErrorException, Logger } from '@nestjs/common';

@Injectable()
export class EmailSenderService implements IEmailSenderService {
  private readonly logger = new Logger(EmailSenderService.name);

  public async send(props: SendEmailProps): Promise<void> {
    const deliveryMode = process.env.EMAIL_DELIVERY_MODE ?? 'resend';
    const from = process.env.EMAIL_FROM ?? 'onboarding@resend.dev';
    const replyTo = process.env.EMAIL_REPLY_TO ?? from;

    if (deliveryMode === 'log') {
      this.logger.warn(
        `Email delivery is disabled. Email to ${props.to}: ${props.subject} - ${props.text}`,
      );
      return;
    }

    if (deliveryMode !== 'resend' && deliveryMode !== 'dev-inbox') {
      throw new InternalServerErrorException('EMAIL_DELIVERY_MODE is invalid');
    }

    if (!process.env.RESEND_API_KEY) {
      throw new InternalServerErrorException(
        'RESEND_API_KEY is not configured',
      );
    }

    const to =
      deliveryMode === 'dev-inbox'
        ? this.getDevInboxRecipient(props.to)
        : props.to;

    const resend = new Resend(process.env.RESEND_API_KEY);

    const { data, error } = await resend.emails.send({
      from,
      to,
      replyTo,
      subject: props.subject,
      text: props.text,
    });

    if (error) {
      this.logger.error(`Failed to send email: ${this.formatError(error)}`);
      throw new InternalServerErrorException('Failed to send email');
    }

    this.logger.log(`Email ${data.id} has been sent`);
  }

  private getDevInboxRecipient(originalRecipient: string): string {
    if (!process.env.DEV_EMAIL_INBOX) {
      throw new InternalServerErrorException(
        'DEV_EMAIL_INBOX is not configured',
      );
    }

    this.logger.warn(
      `Dev inbox mode enabled. Email for ${originalRecipient} will be sent to ${process.env.DEV_EMAIL_INBOX}`,
    );

    return process.env.DEV_EMAIL_INBOX;
  }

  private formatError(error: ErrorResponse): string {
    return [error.name, error.message].filter(Boolean).join(' - ');
  }
}
