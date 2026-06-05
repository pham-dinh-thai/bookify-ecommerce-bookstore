import { SendEmailProps } from '../types';

export interface IEmailSenderService {
  send(props: SendEmailProps): Promise<void>;
}

export const EMAIL_SENDER_SERVICE = 'IEmailSenderService';
