import { Injectable } from '@nestjs/common';
import type { IChatMessageCommandRepository } from '../../../domain/chat-session/repositories/chat-message-command.repository.interface';
import { ChatMessage } from '../../../domain/chat-session/entities/chat-message.entity';
import { TypeOrmUnitOfWork } from '../../../../../shared/modules/unit-of-work/infrastructure/typeorm-unit-of-work';
import { ChatMessageTypeOrm } from '../../entities/chat-message.entity';

@Injectable()
export class TypeOrmChatMessageCommandRepository
  implements IChatMessageCommandRepository
{
  public constructor(private readonly unitOfWork: TypeOrmUnitOfWork) {}

  public async insertMany(messages: ChatMessage[]): Promise<void> {
    const entities = messages.map((m) => {
      const e = new ChatMessageTypeOrm();
      e.id = m.getId();
      e.sessionId = m.getSessionId();
      e.role = m.getRole();
      e.content = m.getContent();
      e.metadata = m.getMetadata();
      return e;
    });

    await this.unitOfWork
      .getManager()
      .insert(ChatMessageTypeOrm, entities);
  }
}
