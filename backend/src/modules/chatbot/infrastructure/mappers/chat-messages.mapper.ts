import { ChatMessage } from '../../domain/chat-session/entities/chat-message.entity';
import { ChatMessageTypeOrm } from '../entities/chat-message.entity';

export class ChatMessagesMapper {
  public static toDomain(entity: ChatMessageTypeOrm): ChatMessage {
    return ChatMessage.fromPersistent({
      id: entity.id,
      sessionId: entity.sessionId,
      content: entity.content,
      role: entity.role,
      metadata: entity.metadata,
    });
  }

  public static toTypeOrm(
    message: ChatMessage,
  ): ChatMessageTypeOrm {
    const entity = new ChatMessageTypeOrm();

    entity.id = message.getId();
    entity.sessionId = message.getSessionId();
    entity.role = message.getRole();
    entity.content = message.getContent();
    entity.metadata = message.getMetadata();

    return entity;
  }
}
