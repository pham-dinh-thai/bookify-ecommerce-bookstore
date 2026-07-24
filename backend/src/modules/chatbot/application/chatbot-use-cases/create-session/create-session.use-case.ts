import { Inject, Injectable } from '@nestjs/common';
import type { ICreateSessionRequest } from './create-session.request';
import { CreateSessionResponse } from './create-session.response';
import { ChatBot } from '../../../domain/chatbot.aggregate';
import type { IChatSessionCommandRepository } from '../../../domain/chat-session/repositories/chat-session-command.repository.interface';
import { CHAT_SESSION_COMMAND_REPOSITORY } from '../../../domain/chat-session/repositories/chat-session-command.repository.interface';
import type { IUuidGenerator } from '../../../../../shared/modules/uuid/domain/uuid-generator.interface';

@Injectable()
export class CreateSessionUseCase {
  public constructor(
    private readonly chatBot: ChatBot,
    @Inject(CHAT_SESSION_COMMAND_REPOSITORY)
    private readonly sessionCommandRepo: IChatSessionCommandRepository,
    @Inject('UUID_GENERATOR')
    private readonly uuidGenerator: IUuidGenerator,
  ) {}

  public async execute(
    request: ICreateSessionRequest,
    userId: string,
  ): Promise<CreateSessionResponse> {
    const id = this.uuidGenerator.generate();
    const session = this.chatBot.createSession(id, userId, request.title);

    await this.sessionCommandRepo.insert(session);

    return new CreateSessionResponse(id, session.getTitle());
  }
}
