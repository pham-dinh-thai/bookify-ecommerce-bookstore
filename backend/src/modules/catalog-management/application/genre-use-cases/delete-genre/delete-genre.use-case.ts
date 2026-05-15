import { Inject, Injectable } from '@nestjs/common';
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
 * Deletes an existing genre from the system.
 *
 * The genre must exist before deletion; a non-existent ID is treated as an error.
 * Every deletion is recorded in the audit log for traceability.
 * Cache is invalidated after a successful commit to ensure consistency.
 */
@Injectable()
export class DeleteGenreUseCase {
  public constructor(
    @Inject(GENRES_COMMAND_REPOSITORY)
    private readonly repository: IGenresCommandRepository,

    @Inject(AUDIT_LOG_COMMAND_REPOSITORY)
    private readonly auditLogRepository: IAuditLogCommandRepository,

    @Inject(UNIT_OF_WORK)
    private readonly unitOfWork: IUnitOfWork,

    @Inject(CACHE_REPOSITORY)
    private readonly cacheRepository: ICacheRepository,
  ) {}

  public async execute(id: string, performedBy: string): Promise<void> {
    const genre = await this.repository.findOne(id);

    await this.unitOfWork.execute(async () => {
      await this.repository.delete(genre);

      await this.auditLogRepository.write(
        'DELETE_GENRES',
        performedBy,
        'genre-management',
        'genres',
        {
          genreId: genre.getId(),
          genreName: genre.getName(),
        },
      );
    });

    await this.cacheRepository.delByPattern('genres:*');
  }
}
