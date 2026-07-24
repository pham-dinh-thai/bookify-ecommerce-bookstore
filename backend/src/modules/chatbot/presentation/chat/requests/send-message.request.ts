import { IsNotEmpty, IsString } from 'class-validator';
import { ISendMessageRequest } from '../../../application/chatbot-use-cases/send-message/send-message.request';

export class SendMessageRequest implements ISendMessageRequest {
  @IsString()
  @IsNotEmpty()
  content!: string;
}
