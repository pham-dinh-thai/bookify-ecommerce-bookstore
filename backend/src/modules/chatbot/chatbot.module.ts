import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatSessionTypeOrm } from './infrastructure/entities/chat-sessions.entity';
import { ChatMessageTypeOrm } from './infrastructure/entities/chat-message.entity';
import { KnowledgeSourceTypeOrm } from './infrastructure/entities/knowledge-source.entity';
import { KnowledgeChunkTypeOrm } from './infrastructure/entities/knowledge-chunk.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ChatSessionTypeOrm,
      ChatMessageTypeOrm,
      KnowledgeSourceTypeOrm,
      KnowledgeChunkTypeOrm,
    ]),
  ],
})
export class ChatbotModule {}
