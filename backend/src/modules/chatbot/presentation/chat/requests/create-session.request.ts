import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ICreateSessionRequest } from '../../../application/chatbot-use-cases/create-session/create-session.request';

export class CreateSessionRequest implements ICreateSessionRequest {
  @IsString()
  @IsOptional()
  title?: string;
}
