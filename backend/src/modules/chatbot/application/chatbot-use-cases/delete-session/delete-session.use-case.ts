import { Inject, Injectable } from '@nestjs/common';
import type { IChatSessionCommandRepository } from '../../../domain/chat-session/repositories/chat-session-command.repository.interface';
import { CHAT_SESSION_COMMAND_REPOSITORY } from '../../../domain/chat-session/repositories/chat-session-command.repository.interface';
import type { IChatSessionQueryRepository } from '../../../domain/chat-session/repositories/chat-session-query.repository.interface';
import { CHAT_SESSION_QUERY_REPOSITORY } from '../../../domain/chat-session/repositories/chat-session-query.repository.interface';
import type { IChatMessageCommandRepository } from '../../../domain/chat-session/repositories/chat-message-command.repository.interface';
import { CHAT_MESSAGE_COMMAND_REPOSITORY } from '../../../domain/chat-session/repositories/chat-message-command.repository.interface';
import { SessionNotFoundException } from '../../../domain/chat-session/exceptions/session-not-found.exception';

@Injectable()
export class DeleteSessionUseCase {
  public constructor(
    @Inject(CHAT_SESSION_COMMAND_REPOSITORY)
    private readonly sessionCommandRepo: IChatSessionCommandRepository,
    @Inject(CHAT_SESSION_QUERY_REPOSITORY)
    private readonly sessionQueryRepo: IChatSessionQueryRepository,
    @Inject(CHAT_MESSAGE_COMMAND_REPOSITORY)
    private readonly messageCommandRepo: IChatMessageCommandRepository,
  ) {}

  public async execute(sessionId: string, userId: string): Promise<void> {
    const exists = await this.sessionQueryRepo.existsById(sessionId, userId);

    if (!exists) {
      throw new SessionNotFoundException();
    }

    await this.sessionCommandRepo.delete(sessionId);
  }
}
