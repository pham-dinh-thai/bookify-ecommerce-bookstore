import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatSessionTypeOrm } from './infrastructure/entities/chat-sessions.entity';
import { ChatMessageTypeOrm } from './infrastructure/entities/chat-message.entity';
import { KnowledgeSourceTypeOrm } from './infrastructure/entities/knowledge-source.entity';
import { KnowledgeChunkTypeOrm } from './infrastructure/entities/knowledge-chunk.entity';
import { ChatController } from './presentation/chat/chat.controller';
import { TypeOrmChatSessionCommandRepository } from './infrastructure/repositories/chat-session/typeorm-chat-session-command.repository';
import { TypeOrmChatSessionQueryRepository } from './infrastructure/repositories/chat-session/typeorm-chat-session-query.repository';
import { TypeOrmChatMessageCommandRepository } from './infrastructure/repositories/chat-message/typeorm-chat-message-command.repository';
import { TypeOrmKnowledgeSourceCommandRepository } from './infrastructure/repositories/knowledge-source/typeorm-knowledge-source-command.repository';
import { TypeOrmKnowledgeSourceQueryRepository } from './infrastructure/repositories/knowledge-source/typeorm-knowledge-source-query.repository';
import { TypeOrmKnowledgeChunkCommandRepository } from './infrastructure/repositories/knowledge-chunk/typeorm-knowledge-chunk-command.repository';
import { TypeOrmKnowledgeChunkQueryRepository } from './infrastructure/repositories/knowledge-chunk/typeorm-knowledge-chunk-query.repository';
import { OpenAIService } from './infrastructure/services/openai.service';
import { DefaultRAGService } from './infrastructure/services/default-rag.service';
import { BookSearchToolService } from './infrastructure/services/book-search-tool.service';
import { CHAT_SESSION_COMMAND_REPOSITORY } from './domain/chat-session/repositories/chat-session-command.repository.interface';
import { CHAT_SESSION_QUERY_REPOSITORY } from './domain/chat-session/repositories/chat-session-query.repository.interface';
import { CHAT_MESSAGE_COMMAND_REPOSITORY } from './domain/chat-session/repositories/chat-message-command.repository.interface';
import { KNOWLEDGE_SOURCE_COMMAND_REPOSITORY } from './domain/knowledge-source/repositories/knowledge-source-command.repository.interface';
import { KNOWLEDGE_SOURCE_QUERY_REPOSITORY } from './domain/knowledge-source/repositories/knowledge-source-query.repository.interface';
import { KNOWLEDGE_CHUNK_COMMAND_REPOSITORY } from './domain/knowledge-source/repositories/knowledge-chunk-command.repository.interface';
import { KNOWLEDGE_CHUNK_QUERY_REPOSITORY } from './domain/knowledge-source/repositories/knowledge-chunk-query.repository.interface';
import { AI_SERVICE } from './application/ports/ai-service.interface';
import { RAG_SERVICE } from './application/ports/rag-service.interface';
import { TOOL_SERVICE } from './application/ports/tool-service.interface';
import { ChatBot } from './domain/chatbot.aggregate';
import { CreateSessionUseCase } from './application/chatbot-use-cases/create-session/create-session.use-case';
import { SendMessageUseCase } from './application/chatbot-use-cases/send-message/send-message.use-case';
import { GetHistoryUseCase } from './application/chatbot-use-cases/get-history/get-history.use-case';
import { ListSessionsUseCase } from './application/chatbot-use-cases/list-sessions/list-sessions.use-case';
import { UuidModule } from '../../shared/modules/uuid/uuid.module';
import { UnitOfWorkModule } from '../../shared/modules/unit-of-work/unit-of-work.module';
import { BookManagementModule } from '../book-management/book-management.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ChatSessionTypeOrm,
      ChatMessageTypeOrm,
      KnowledgeSourceTypeOrm,
      KnowledgeChunkTypeOrm,
    ]),
    UuidModule,
    UnitOfWorkModule,
    BookManagementModule,
  ],
  controllers: [ChatController],
  providers: [
    {
      provide: CHAT_SESSION_COMMAND_REPOSITORY,
      useClass: TypeOrmChatSessionCommandRepository,
    },
    {
      provide: CHAT_SESSION_QUERY_REPOSITORY,
      useClass: TypeOrmChatSessionQueryRepository,
    },
    {
      provide: CHAT_MESSAGE_COMMAND_REPOSITORY,
      useClass: TypeOrmChatMessageCommandRepository,
    },
    {
      provide: KNOWLEDGE_SOURCE_COMMAND_REPOSITORY,
      useClass: TypeOrmKnowledgeSourceCommandRepository,
    },
    {
      provide: KNOWLEDGE_SOURCE_QUERY_REPOSITORY,
      useClass: TypeOrmKnowledgeSourceQueryRepository,
    },
    {
      provide: KNOWLEDGE_CHUNK_COMMAND_REPOSITORY,
      useClass: TypeOrmKnowledgeChunkCommandRepository,
    },
    {
      provide: KNOWLEDGE_CHUNK_QUERY_REPOSITORY,
      useClass: TypeOrmKnowledgeChunkQueryRepository,
    },
    { provide: AI_SERVICE, useClass: OpenAIService },
    { provide: RAG_SERVICE, useClass: DefaultRAGService },
    { provide: TOOL_SERVICE, useClass: BookSearchToolService },
    ChatBot,
    CreateSessionUseCase,
    SendMessageUseCase,
    GetHistoryUseCase,
    ListSessionsUseCase,
  ],
  exports: [ChatBot],
})
export class ChatbotModule {}
