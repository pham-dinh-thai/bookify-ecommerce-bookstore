import { ChatSession } from '../../domain/chat-session/chat-session.aggregate';
import { ChatSessionTypeOrm } from '../entities/chat-sessions.entity';
import { ChatMessageTypeOrm } from '../entities/chat-message.entity';
import { ChatMessage } from '../../domain/chat-session/entities/chat-message.entity';
import { ChatMessageReadModel } from '../../domain/chat-session/read-models/chat-message.read-model';
import {
  ChatSessionDetailReadModel,
  ChatSessionReadModel,
} from '../../domain/chat-session/read-models/chat-session.read-model';

export class ChatSessionsMapper {
  public static toDomain(
    entity: ChatSessionTypeOrm,
    messages?: ChatMessageTypeOrm[],
  ): ChatSession {
    return ChatSession.fromPersistent({
      id: entity.id,
      userId: entity.userId,
      title: entity.title,
      messages: (messages ?? []).map((m) =>
        ChatMessage.fromPersistent({
          id: m.id,
          sessionId: m.sessionId,
          content: m.content,
          role: m.role,
          metadata: m.metadata,
        }),
      ),
    });
  }

  public static toSessionReadModel(
    entity: ChatSessionTypeOrm,
  ): ChatSessionReadModel {
    return new ChatSessionReadModel(
      entity.id,
      entity.userId,
      entity.title,
      entity.createdAt,
      entity.updatedAt,
    );
  }

  public static toSessionDetailReadModel(
    entity: ChatSessionTypeOrm,
    messages: ChatMessageTypeOrm[],
  ): ChatSessionDetailReadModel {
    return new ChatSessionDetailReadModel(
      entity.id,
      entity.userId,
      entity.title,
      messages.map((m) =>
        new ChatMessageReadModel(
          m.id,
          m.sessionId,
          m.role,
          m.content,
          m.metadata,
          m.createdAt,
        ),
      ),
      entity.createdAt,
      entity.updatedAt,
    );
  }
}
