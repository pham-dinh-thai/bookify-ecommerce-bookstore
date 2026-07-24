import type { ChatSessionDetailReadModel, ChatSessionReadModel } from '../read-models/chat-session.read-model';

export interface IChatSessionQueryRepository {
  findUserSessions(userId: string): Promise<ChatSessionReadModel[]>;
  findDetail(id: string, userId: string): Promise<ChatSessionDetailReadModel>;
  existsById(id: string, userId: string): Promise<boolean>;
}

export const CHAT_SESSION_QUERY_REPOSITORY =
  'IChatSessionQueryRepository';
