import { Injectable } from '@nestjs/common';
import { IChatSessionQueryRepository } from '../../../domain/chat-session/repositories/chat-session-query.repository.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatSessionTypeOrm } from '../../entities/chat-sessions.entity';
import { ChatMessageTypeOrm } from '../../entities/chat-message.entity';
import { Repository } from 'typeorm';
import { ChatSessionsMapper } from '../../mappers/chat-sessions.mapper';
import {
  ChatSessionDetailReadModel,
  ChatSessionReadModel,
} from '../../../domain/chat-session/read-models/chat-session.read-model';
import { SessionNotFoundException } from '../../../domain/chat-session/exceptions/session-not-found.exception';

@Injectable()
export class TypeOrmChatSessionQueryRepository
  implements IChatSessionQueryRepository
{
  public constructor(
    @InjectRepository(ChatSessionTypeOrm)
    private readonly repository: Repository<ChatSessionTypeOrm>,
  ) {}

  public async findUserSessions(
    userId: string,
  ): Promise<ChatSessionReadModel[]> {
    const entities: ChatSessionTypeOrm[] = await this.repository.find({
      where: { userId },
      order: { updatedAt: 'DESC' },
    });

    return entities.map((e) => ChatSessionsMapper.toSessionReadModel(e));
  }

  public async findDetail(
    id: string,
    userId: string,
  ): Promise<ChatSessionDetailReadModel> {
    const entity: ChatSessionTypeOrm | null = await this.repository.findOne({
      where: { id, userId },
      relations: { messages: true },
    });

    if (!entity) {
      throw new SessionNotFoundException();
    }

    const messages = await this.repository.manager.find(
      ChatMessageTypeOrm,
      {
        where: { sessionId: id },
        order: { createdAt: 'ASC' },
      },
    );

    return ChatSessionsMapper.toSessionDetailReadModel(entity, messages);
  }

  public async existsById(id: string, userId: string): Promise<boolean> {
    const count = await this.repository.count({
      where: { id, userId },
    });

    return count > 0;
  }
}
