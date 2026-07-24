import { Inject, Injectable } from '@nestjs/common';
import type { ICreateKnowledgeSourceRequest } from './create-knowledge-source.request';
import { CreateKnowledgeSourceResponse } from './create-knowledge-source.response';
import { ChatBot } from '../../../domain/chatbot.aggregate';
import type { IKnowledgeSourceCommandRepository } from '../../../domain/knowledge-source/repositories/knowledge-source-command.repository.interface';
import { KNOWLEDGE_SOURCE_COMMAND_REPOSITORY } from '../../../domain/knowledge-source/repositories/knowledge-source-command.repository.interface';
import type { IKnowledgeIngestionService } from '../../ports/knowledge-ingestion-service.interface';
import { KNOWLEDGE_INGESTION_SERVICE } from '../../ports/knowledge-ingestion-service.interface';
import type { IUuidGenerator } from '../../../../../shared/modules/uuid/domain/uuid-generator.interface';

@Injectable()
export class CreateKnowledgeSourceUseCase {
  public constructor(
    private readonly chatBot: ChatBot,
    @Inject(KNOWLEDGE_SOURCE_COMMAND_REPOSITORY)
    private readonly knowledgeSourceCommandRepo: IKnowledgeSourceCommandRepository,
    @Inject(KNOWLEDGE_INGESTION_SERVICE)
    private readonly ingestionService: IKnowledgeIngestionService,
    @Inject('UUID_GENERATOR')
    private readonly uuidGenerator: IUuidGenerator,
  ) {}

  public async execute(
    request: ICreateKnowledgeSourceRequest,
  ): Promise<CreateKnowledgeSourceResponse> {
    const id = this.uuidGenerator.generate();

    const source = this.chatBot.createKnowledgeSource(
      id,
      request.sourceType,
      request.title,
      request.content,
      request.language,
    );

    await this.knowledgeSourceCommandRepo.insert(source);

    await this.ingestionService.ingest(source);

    const chunkCount = source.chunkContent(800).length;

    return new CreateKnowledgeSourceResponse(id, source.getTitle(), chunkCount);
  }
}
