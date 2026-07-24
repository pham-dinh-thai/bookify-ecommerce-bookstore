import { Inject, Injectable } from '@nestjs/common';
import { GetHistoryResponse } from './get-history.response';
import type { IChatSessionQueryRepository } from '../../../domain/chat-session/repositories/chat-session-query.repository.interface';
import { CHAT_SESSION_QUERY_REPOSITORY } from '../../../domain/chat-session/repositories/chat-session-query.repository.interface';

@Injectable()
export class GetHistoryUseCase {
  public constructor(
    @Inject(CHAT_SESSION_QUERY_REPOSITORY)
    private readonly sessionQueryRepo: IChatSessionQueryRepository,
  ) {}

  public async execute(
    sessionId: string,
    userId: string,
  ): Promise<GetHistoryResponse> {
    const session = await this.sessionQueryRepo.findDetail(sessionId, userId);

    return new GetHistoryResponse(session);
  }
}
