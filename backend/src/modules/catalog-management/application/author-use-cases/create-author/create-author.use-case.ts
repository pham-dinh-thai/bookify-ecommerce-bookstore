import { Inject, Injectable } from '@nestjs/common';
import { ICreateAuthorRequest } from './create-author.request';
import {
  AUTHORS_COMMAND_REPOSITORY,
  type IAuthorsCommandRepository,
} from '../../../domain/author-aggregate/repositories/authors-command.repository.interface';
import {
  AUDIT_LOG_COMMAND_REPOSITORY,
  type IAuditLogCommandRepository,
} from '../../../../audit-log/domain/audit-log-aggregate/repositories/audit-log-command.repository.interface';
import {
  type IUnitOfWork,
  UNIT_OF_WORK,
} from '../../../../../shared/modules/unit-of-work/application/unit-of-work';
import {
  CACHE_REPOSITORY,
  type ICacheRepository,
} from '../../../../../shared/modules/cache/domain/cache.repository.interface';
import { Author } from '../../../domain/author-aggregate/author.aggregate';
import {
  type IUuidGenerator,
  UUID_GENERATOR,
} from '../../../../../shared/modules/uuid/domain/uuid-generator.interface';

@Injectable()
export class CreateAuthorUseCase {
  public constructor(
    @Inject(AUTHORS_COMMAND_REPOSITORY)
    private readonly authorsCommandRepository: IAuthorsCommandRepository,

    @Inject(AUDIT_LOG_COMMAND_REPOSITORY)
    private readonly auditLogCommandRepository: IAuditLogCommandRepository,

    @Inject(UNIT_OF_WORK)
    private readonly unitOfWork: IUnitOfWork,

    @Inject(CACHE_REPOSITORY)
    private readonly cacheRepository: ICacheRepository,

    @Inject(UUID_GENERATOR)
    private readonly uuidGenerator: IUuidGenerator,
  ) {}

  public async execute(
    request: ICreateAuthorRequest,
    performedBy: string,
  ): Promise<void> {
    const author = Author.create(this.uuidGenerator.generate(), request.name);

    await this.unitOfWork.execute(async () => {
      await this.authorsCommandRepository.save(author);

      await this.auditLogCommandRepository.write(
        'CREATE_AUTHOR',
        performedBy,
        'catalog-management',
        'authors',
        {
          authorId: author.getId(),
          authorName: author.getName(),
        },
      );
    });

    await this.cacheRepository.delByPattern('authors:*');
  }
}
