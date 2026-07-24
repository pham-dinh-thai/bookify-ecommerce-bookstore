import { Inject, Injectable } from '@nestjs/common';
import { ListSessionsResponse } from './list-sessions.response';
import type { IChatSessionQueryRepository } from '../../../domain/chat-session/repositories/chat-session-query.repository.interface';
import { CHAT_SESSION_QUERY_REPOSITORY } from '../../../domain/chat-session/repositories/chat-session-query.repository.interface';

@Injectable()
export class ListSessionsUseCase {
  public constructor(
    @Inject(CHAT_SESSION_QUERY_REPOSITORY)
    private readonly sessionQueryRepo: IChatSessionQueryRepository,
  ) {}

  public async execute(userId: string): Promise<ListSessionsResponse> {
    const sessions = await this.sessionQueryRepo.findUserSessions(userId);

    return new ListSessionsResponse(sessions);
  }
}
