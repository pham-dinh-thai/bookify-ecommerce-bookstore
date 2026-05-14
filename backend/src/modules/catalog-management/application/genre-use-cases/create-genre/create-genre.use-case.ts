import { Inject, Injectable } from '@nestjs/common';
import {
  GENRES_COMMAND_REPOSITORY,
  type IGenresCommandRepository,
} from '../../../domain/genre-aggregate/repositories/genres-command.repository.interface';
import { ICreateGenreRequest } from './create-genre.request';
import {
  type IUuidGenerator,
  UUID_GENERATOR,
} from '../../../../../shared/modules/uuid/domain/uuid-generator.interface';
import {
  type IUnitOfWork,
  UNIT_OF_WORK,
} from '../../../../../shared/modules/unit-of-work/application/unit-of-work';
import {
  AUDIT_LOG_COMMAND_REPOSITORY,
  type IAuditLogCommandRepository,
} from '../../../../audit-log/domain/audit-log-aggregate/repositories/audit-log-command.repository.interface';
import { Genre } from '../../../domain/genre-aggregate/genre.aggregate';
import {
  CACHE_REPOSITORY,
  type ICacheRepository,
} from '../../../../../shared/modules/cache/domain/cache.repository.interface';

@Injectable()
export class CreateGenreUseCase {
  public constructor(
    @Inject(GENRES_COMMAND_REPOSITORY)
    private readonly repository: IGenresCommandRepository,

    @Inject(UUID_GENERATOR)
    private readonly uuid: IUuidGenerator,

    @Inject(UNIT_OF_WORK)
    private readonly unitOfWork: IUnitOfWork,

    @Inject(AUDIT_LOG_COMMAND_REPOSITORY)
    private readonly auditLogRepository: IAuditLogCommandRepository,

    @Inject(CACHE_REPOSITORY)
    private readonly cacheRepository: ICacheRepository,
  ) {}

  public async execute(
    request: ICreateGenreRequest,
    performedBy: string,
  ): Promise<void> {
    const id = this.uuid.generate();

    const genre = Genre.create(id, request.name);

    await this.unitOfWork.execute(async () => {
      await this.repository.save(genre);

      await this.auditLogRepository.write(
        'CREATE_GENRE',
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
