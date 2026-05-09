import { Inject, Injectable } from '@nestjs/common';
import {
  AUTHORS_COMMAND_REPOSITORY,
  type IAuthorsCommandRepository,
} from '../../../domain/author-aggregate/repositories/authors-command.repository.interface';
import {
  type IUnitOfWork,
  UNIT_OF_WORK,
} from '../../../../../shared/unit-of-work/application/unit-of-work';
import {
  AUDIT_LOG_COMMAND_REPOSITORY,
  type IAuditLogCommandRepository,
} from '../../../../audit-log/domain/audit-log-aggregate/repositories/audit-log-command.repository.interface';
import {
  CACHE_REPOSITORY,
  type ICacheRepository,
} from '../../../../../shared/cache/domain/cache.repository.interface';
import { AUTHOR_CACHE_KEYS } from '../author-cache.constants';

@Injectable()
export class DeleteAuthorUseCase {
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

  public async execute(id: string, performedBy: string): Promise<void> {
    const author = await this.authorsCommandRepository.findOne(id);

    await this.unitOfWork.execute(async () => {
      await this.authorsCommandRepository.delete(author);

      await this.auditLogCommandRepository.write(
        'DELETE_AUTHOR',
        performedBy,
        'author-management',
        'authors',
        {
          authorId: author.getId(),
        },
      );
    });

    await this.cacheRepository.delByPattern('authors:*');
  }
}
