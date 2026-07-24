import { Inject, Injectable } from '@nestjs/common';
import type { IUpdateKnowledgeSourceRequest } from './update-knowledge-source.request';
import { UpdateKnowledgeSourceResponse } from './update-knowledge-source.response';
import type { IKnowledgeSourceCommandRepository } from '../../../domain/knowledge-source/repositories/knowledge-source-command.repository.interface';
import { KNOWLEDGE_SOURCE_COMMAND_REPOSITORY } from '../../../domain/knowledge-source/repositories/knowledge-source-command.repository.interface';
import type { IKnowledgeSourceQueryRepository } from '../../../domain/knowledge-source/repositories/knowledge-source-query.repository.interface';
import { KNOWLEDGE_SOURCE_QUERY_REPOSITORY } from '../../../domain/knowledge-source/repositories/knowledge-source-query.repository.interface';
import { KnowledgeSourceNotFoundException } from '../../../domain/exceptions/knowledge-source-not-found.exception';
import type { IKnowledgeChunkCommandRepository } from '../../../domain/knowledge-source/repositories/knowledge-chunk-command.repository.interface';
import { KNOWLEDGE_CHUNK_COMMAND_REPOSITORY } from '../../../domain/knowledge-source/repositories/knowledge-chunk-command.repository.interface';
import type { IKnowledgeIngestionService } from '../../ports/knowledge-ingestion-service.interface';
import { KNOWLEDGE_INGESTION_SERVICE } from '../../ports/knowledge-ingestion-service.interface';
import { KnowledgeSourceType } from '../../../domain/knowledge-source/enums/knowledge-source-type.enum';

@Injectable()
export class UpdateKnowledgeSourceUseCase {
  public constructor(
    @Inject(KNOWLEDGE_SOURCE_COMMAND_REPOSITORY)
    private readonly knowledgeSourceCommandRepo: IKnowledgeSourceCommandRepository,
    @Inject(KNOWLEDGE_SOURCE_QUERY_REPOSITORY)
    private readonly knowledgeSourceQueryRepo: IKnowledgeSourceQueryRepository,
    @Inject(KNOWLEDGE_CHUNK_COMMAND_REPOSITORY)
    private readonly chunkCommandRepo: IKnowledgeChunkCommandRepository,
    @Inject(KNOWLEDGE_INGESTION_SERVICE)
    private readonly ingestionService: IKnowledgeIngestionService,
  ) {}

  public async execute(
    id: string,
    request: IUpdateKnowledgeSourceRequest,
  ): Promise<UpdateKnowledgeSourceResponse> {
    const source = await this.knowledgeSourceQueryRepo.findOne(id);

    if (!source) {
      throw new KnowledgeSourceNotFoundException();
    }

    if (request.title !== undefined) {
      source.updateTitle(request.title);
    }

    if (request.content !== undefined) {
      source.updateContent(request.content);
    }

    if (request.language !== undefined) {
      source.updateLanguage(request.language);
    }

    if (request.isActive !== undefined) {
      if (request.isActive) {
        source.activate();
      } else {
        source.deactivate();
      }
    }

    if (request.sourceType !== undefined) {
      source.updateSourceType(request.sourceType as KnowledgeSourceType);
    }

    await this.knowledgeSourceCommandRepo.save(source);

    if (request.content !== undefined) {
      await this.chunkCommandRepo.deleteBySourceId(id);
      await this.ingestionService.ingest(source);
    }

    return new UpdateKnowledgeSourceResponse(id, source.getTitle());
  }
}
