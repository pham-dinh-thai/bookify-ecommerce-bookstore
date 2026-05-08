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
} from '../../../../../shared/unit-of-work/application/unit-of-work';
import {
  CACHE_REPOSITORY,
  type ICacheRepository,
} from '../../../../../shared/cache/domain/cache.repository.interface';
import { GENRE_CACHE_KEYS } from '../genre-cache.constants';

@Injectable()
export class RenameGenreUseCase {
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

  public async execute(
    id: string,
    request: IRenameGenreRequest,
    performedBy: string,
  ): Promise<void> {
    const genre = await this.repository.findOne(id);

    if (genre.getName() === request.name) {
      return;
    }

    const { oldName, newName } = genre.rename(request.name);

    await this.unitOfWork.execute(async () => {
      await this.repository.save(genre);

      await this.auditLogRepository.write(
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

    await this.cacheRepository.del(GENRE_CACHE_KEYS.ALL);
  }
}
