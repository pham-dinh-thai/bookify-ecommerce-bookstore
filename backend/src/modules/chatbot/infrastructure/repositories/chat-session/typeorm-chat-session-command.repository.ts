import { Injectable } from '@nestjs/common';
import type { IChatSessionCommandRepository } from '../../../domain/chat-session/repositories/chat-session-command.repository.interface';
import { ChatSession } from '../../../domain/chat-session/chat-session.aggregate';
import { TypeOrmUnitOfWork } from '../../../../../shared/modules/unit-of-work/infrastructure/typeorm-unit-of-work';
import { ChatSessionTypeOrm } from '../../entities/chat-sessions.entity';
import { ChatMessageTypeOrm } from '../../entities/chat-message.entity';
import { ChatSessionsMapper } from '../../mappers/chat-sessions.mapper';
import { SessionNotFoundException } from '../../../domain/chat-session/exceptions/session-not-found.exception';

@Injectable()
export class TypeOrmChatSessionCommandRepository
  implements IChatSessionCommandRepository
{
  public constructor(private readonly unitOfWork: TypeOrmUnitOfWork) {}

  public async findOne(id: string): Promise<ChatSession> {
    const entity: ChatSessionTypeOrm | null = await this.unitOfWork
      .getManager()
      .findOne(ChatSessionTypeOrm, {
        where: { id },
        relations: { messages: true },
      });

    if (!entity) {
      throw new SessionNotFoundException();
    }

    return ChatSessionsMapper.toDomain(entity, entity.messages);
  }

  public async insert(session: ChatSession): Promise<void> {
    const entity = new ChatSessionTypeOrm();
    entity.id = session.getId();
    entity.userId = session.getUserId();
    entity.title = session.getTitle();

    await this.unitOfWork.getManager().insert(ChatSessionTypeOrm, entity);
  }

  public async save(session: ChatSession): Promise<void> {
    const entity = new ChatSessionTypeOrm();
    entity.id = session.getId();
    entity.userId = session.getUserId();
    entity.title = session.getTitle();

    await this.unitOfWork
      .getManager()
      .save(ChatSessionTypeOrm, entity);
  }

  public async delete(id: string): Promise<void> {
    await this.unitOfWork.getManager().delete(ChatSessionTypeOrm, { id });
  }
}
