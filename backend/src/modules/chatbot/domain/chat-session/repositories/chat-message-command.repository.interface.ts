import { ChatMessage } from '../entities/chat-message.entity';

export interface IChatMessageCommandRepository {
  insertMany(messages: ChatMessage[]): Promise<void>;
}

export const CHAT_MESSAGE_COMMAND_REPOSITORY =
  'IChatMessageCommandRepository';
