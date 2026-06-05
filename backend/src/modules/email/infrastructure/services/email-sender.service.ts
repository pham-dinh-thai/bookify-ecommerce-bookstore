import { Resend } from 'resend';
import { IEmailSenderService } from '../../domain/email-aggregate/services/email-sender.service';
import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import { SendEmailProps } from '../../domain/email-aggregate/types';

@Injectable()
export class EmailSenderService implements IEmailSenderService {
  public async send(props: SendEmailProps): Promise<void> {
    const resend = new Resend(process.env.RESEND_API_KEY);

    const { data }: { data: any } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: props.to,
      replyTo: 'onboarding@resend.dev',
      subject: props.subject,
      text: props.text,
    });

    console.log(`Email ${data.id} has been sent`);
  }
}
