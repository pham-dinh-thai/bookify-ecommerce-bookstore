import { Inject, Injectable } from '@nestjs/common';
import type { IUpdateSessionTitleRequest } from './update-session-title.request';
import { UpdateSessionTitleResponse } from './update-session-title.response';
import type { IChatSessionCommandRepository } from '../../../domain/chat-session/repositories/chat-session-command.repository.interface';
import { CHAT_SESSION_COMMAND_REPOSITORY } from '../../../domain/chat-session/repositories/chat-session-command.repository.interface';
import type { IChatSessionQueryRepository } from '../../../domain/chat-session/repositories/chat-session-query.repository.interface';
import { CHAT_SESSION_QUERY_REPOSITORY } from '../../../domain/chat-session/repositories/chat-session-query.repository.interface';
import { SessionNotFoundException } from '../../../domain/chat-session/exceptions/session-not-found.exception';

@Injectable()
export class UpdateSessionTitleUseCase {
  public constructor(
    @Inject(CHAT_SESSION_COMMAND_REPOSITORY)
    private readonly sessionCommandRepo: IChatSessionCommandRepository,
    @Inject(CHAT_SESSION_QUERY_REPOSITORY)
    private readonly sessionQueryRepo: IChatSessionQueryRepository,
  ) {}

  public async execute(
    sessionId: string,
    userId: string,
    request: IUpdateSessionTitleRequest,
  ): Promise<UpdateSessionTitleResponse> {
    const exists = await this.sessionQueryRepo.existsById(sessionId, userId);

    if (!exists) {
      throw new SessionNotFoundException();
    }

    const session = await this.sessionCommandRepo.findOne(sessionId);

    session.updateTitle(request.title);

    await this.sessionCommandRepo.save(session);

    return new UpdateSessionTitleResponse(sessionId, session.getTitle());
  }
}
