import { Inject, Injectable } from '@nestjs/common';
import type { ISendMessageRequest } from '../send-message/send-message.request';
import { ChatBot } from '../../../domain/chatbot.aggregate';
import type { IChatSessionCommandRepository } from '../../../domain/chat-session/repositories/chat-session-command.repository.interface';
import { CHAT_SESSION_COMMAND_REPOSITORY } from '../../../domain/chat-session/repositories/chat-session-command.repository.interface';
import type { IChatSessionQueryRepository } from '../../../domain/chat-session/repositories/chat-session-query.repository.interface';
import { CHAT_SESSION_QUERY_REPOSITORY } from '../../../domain/chat-session/repositories/chat-session-query.repository.interface';
import type { IChatMessageCommandRepository } from '../../../domain/chat-session/repositories/chat-message-command.repository.interface';
import { CHAT_MESSAGE_COMMAND_REPOSITORY } from '../../../domain/chat-session/repositories/chat-message-command.repository.interface';
import type { IUuidGenerator } from '../../../../../shared/modules/uuid/domain/uuid-generator.interface';
import { MessageRole } from '../../../domain/chat-session/enums/message-role.enum';
import type { IAIService } from '../../ports/ai-service.interface';
import { AI_SERVICE } from '../../ports/ai-service.interface';
import type { IRAGService } from '../../ports/rag-service.interface';
import { RAG_SERVICE } from '../../ports/rag-service.interface';
import type { IToolService } from '../../ports/tool-service.interface';
import { TOOL_SERVICE } from '../../ports/tool-service.interface';

@Injectable()
export class SendMessageStreamUseCase {
  public constructor(
    private readonly chatBot: ChatBot,
    @Inject(AI_SERVICE)
    private readonly aiService: IAIService,
    @Inject(RAG_SERVICE)
    private readonly ragService: IRAGService,
    @Inject(TOOL_SERVICE)
    private readonly toolService: IToolService,
    @Inject(CHAT_SESSION_COMMAND_REPOSITORY)
    private readonly sessionCommandRepo: IChatSessionCommandRepository,
    @Inject(CHAT_SESSION_QUERY_REPOSITORY)
    private readonly sessionQueryRepo: IChatSessionQueryRepository,
    @Inject(CHAT_MESSAGE_COMMAND_REPOSITORY)
    private readonly messageCommandRepo: IChatMessageCommandRepository,
    @Inject('UUID_GENERATOR')
    private readonly uuidGenerator: IUuidGenerator,
  ) {}

  public async execute(
    sessionId: string,
    request: ISendMessageRequest,
    userId: string,
    onChunk: (chunk: string) => void,
  ): Promise<void> {
    const exists = await this.sessionQueryRepo.existsById(sessionId, userId);

    if (!exists) {
      throw new Error('Session not found or access denied.');
    }

    const session = await this.sessionCommandRepo.findOne(sessionId);

    const userMessage = session.addMessage(
      this.uuidGenerator.generate(),
      request.content,
      MessageRole.USER,
    );

    const [ragChunks, productResults] = await Promise.all([
      this.ragService.retrieveRelevantChunks(request.content),
      this.toolService.searchProducts(request.content),
    ]);

    const systemPrompt = this.chatBot.buildSystemPrompt(ragChunks, productResults);

    const recentMessages = session.getRecentMessages(10);

    let fullResponse = '';

    await this.aiService.chatStream({
      systemPrompt,
      messages: recentMessages.map((m) => ({
        role: m.getRole() as 'user' | 'assistant',
        content: m.getContent(),
      })),
      onChunk: (chunk) => {
        fullResponse += chunk;
        onChunk(chunk);
      },
    });

    const assistantMessage = session.addMessage(
      this.uuidGenerator.generate(),
      fullResponse,
      MessageRole.ASSISTANT,
    );

    await this.messageCommandRepo.insertMany([userMessage, assistantMessage]);
  }
}
