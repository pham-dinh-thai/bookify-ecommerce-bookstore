import { Inject, Injectable } from '@nestjs/common';
import { IRenameGenreRequest } from './rename-genre.request';
import {
  GENRES_COMMAND_REPOSITORY,
  type IGenresCommandRepository,
} from '../../../domain/genre-aggregate/repositories/genres-command.repository.interface';
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

/**
 * Renames an existing genre.
 *
 * If the new name is identical to the current one, the operation is skipped entirely.
 * Every rename is recorded in the audit log with both the old and new name for traceability.
 * Cache is invalidated after a successful commit to ensure consistency.
 */
@Injectable()
export class RenameGenreUseCase {
  public constructor(
    @Inject(GENRES_COMMAND_REPOSITORY)
    private readonly genresCommandRepository: IGenresCommandRepository,

    @Inject(AUDIT_LOG_COMMAND_REPOSITORY)
    private readonly auditLogCommandRepository: IAuditLogCommandRepository,

    @Inject(UNIT_OF_WORK)
    private readonly unitOfWork: IUnitOfWork,

    @Inject(CACHE_REPOSITORY)
    private readonly cacheRepository: ICacheRepository,
  ) {}

  public async execute(
    id: string,
    request: IRenameGenreRequest,
    performedBy: string,
  ): Promise<void> {
    const genre = await this.genresCommandRepository.findOne(id);

    if (genre.getName() === request.name) {
      return;
    }

    const { oldName, newName } = genre.rename(request.name);

    await this.unitOfWork.execute(async () => {
      await this.genresCommandRepository.save(genre);

      await this.auditLogCommandRepository.write(
        'RENAME_GENRE',
        performedBy,
        'genre-management',
        'genres',
        {
          genreId: genre.getId(),
          genreOldName: oldName,
          genreNewName: newName,
        },
      );
    });

    await this.cacheRepository.delByPattern('genres:*');
  }
}
