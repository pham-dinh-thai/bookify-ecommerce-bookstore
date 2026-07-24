import { Inject, Injectable } from '@nestjs/common';
import type { IKnowledgeSourceCommandRepository } from '../../../domain/knowledge-source/repositories/knowledge-source-command.repository.interface';
import { KNOWLEDGE_SOURCE_COMMAND_REPOSITORY } from '../../../domain/knowledge-source/repositories/knowledge-source-command.repository.interface';
import type { IKnowledgeSourceQueryRepository } from '../../../domain/knowledge-source/repositories/knowledge-source-query.repository.interface';
import { KNOWLEDGE_SOURCE_QUERY_REPOSITORY } from '../../../domain/knowledge-source/repositories/knowledge-source-query.repository.interface';
import type { IKnowledgeChunkCommandRepository } from '../../../domain/knowledge-source/repositories/knowledge-chunk-command.repository.interface';
import { KNOWLEDGE_CHUNK_COMMAND_REPOSITORY } from '../../../domain/knowledge-source/repositories/knowledge-chunk-command.repository.interface';
import { KnowledgeSourceNotFoundException } from '../../../domain/exceptions/knowledge-source-not-found.exception';

@Injectable()
export class DeleteKnowledgeSourceUseCase {
  public constructor(
    @Inject(KNOWLEDGE_SOURCE_COMMAND_REPOSITORY)
    private readonly knowledgeSourceCommandRepo: IKnowledgeSourceCommandRepository,
    @Inject(KNOWLEDGE_SOURCE_QUERY_REPOSITORY)
    private readonly knowledgeSourceQueryRepo: IKnowledgeSourceQueryRepository,
    @Inject(KNOWLEDGE_CHUNK_COMMAND_REPOSITORY)
    private readonly chunkCommandRepo: IKnowledgeChunkCommandRepository,
  ) {}

  public async execute(id: string): Promise<void> {
    const source = await this.knowledgeSourceQueryRepo.findOne(id);

    if (!source) {
      throw new KnowledgeSourceNotFoundException();
    }

    await this.chunkCommandRepo.deleteBySourceId(id);
    await this.knowledgeSourceCommandRepo.delete(id);
  }
}
