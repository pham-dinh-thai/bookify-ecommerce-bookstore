import { ChatSession } from '../chat-session.aggregate';

export interface IChatSessionCommandRepository {
  findOne(id: string): Promise<ChatSession>;
  insert(session: ChatSession): Promise<void>;
  save(session: ChatSession): Promise<void>;
  delete(id: string): Promise<void>;
}

export const CHAT_SESSION_COMMAND_REPOSITORY =
  'IChatSessionCommandRepository';
