import { Inject, Injectable } from '@nestjs/common';
import { IRenameAuthorRequest } from './rename-author.request';
import {
  AUTHORS_COMMAND_REPOSITORY,
  type IAuthorsCommandRepository,
} from '../../../domain/author-aggregate/repositories/authors-command.repository.interface';
import {
  type IUnitOfWork,
  UNIT_OF_WORK,
} from '../../../../../shared/modules/unit-of-work/application/unit-of-work';
import {
  AUDIT_LOG_COMMAND_REPOSITORY,
  type IAuditLogCommandRepository,
} from '../../../../audit-log/domain/audit-log-aggregate/repositories/audit-log-command.repository.interface';
import {
  CACHE_REPOSITORY,
  type ICacheRepository,
} from '../../../../../shared/modules/cache/domain/cache.repository.interface';

/**
 * Renames an existing author.
 *
 * If the new name is identical to the current one, the operation is skipped entirely.
 * Every rename is recorded in the audit log with both the old and new name for traceability.
 * Cache is invalidated after a successful commit to ensure consistency.
 */
@Injectable()
export class RenameAuthorUseCase {
  public constructor(
    @Inject(AUTHORS_COMMAND_REPOSITORY)
    private readonly authorsCommandRepository: IAuthorsCommandRepository,

    @Inject(UNIT_OF_WORK)
    private readonly unitOfWork: IUnitOfWork,

    @Inject(AUDIT_LOG_COMMAND_REPOSITORY)
    private readonly auditLogCommandRepository: IAuditLogCommandRepository,

    @Inject(CACHE_REPOSITORY)
    private readonly cacheRepository: ICacheRepository,
  ) {}

  public async execute(
    id: string,
    request: IRenameAuthorRequest,
    performedBy: string,
  ): Promise<void> {
    const author = await this.authorsCommandRepository.findOne(id);

    if (request.name === author.getName()) {
      return;
    }

    const { newName, oldName } = author.rename(request.name);

    await this.unitOfWork.execute(async () => {
      await this.authorsCommandRepository.save(author);

      await this.auditLogCommandRepository.write(
        'RENAME_AUTHOR',
        performedBy,
        'catalog-management',
        'authors',
        {
          authorId: author.getId(),
          oldName: oldName,
          newName: newName,
        },
      );
    });

    await this.cacheRepository.delByPattern('authors:*');
  }
}
