import { Inject, Injectable } from '@nestjs/common';
import {
  GENRES_COMMAND_REPOSITORY,
  type IGenresCommandRepository,
} from '../../../domain/genre-aggregate/repositories/genres-command.repository.interface';
import {
  type IRolesCommandRepository,
  ROLES_COMMAND_REPOSITORY,
} from '../../../../authorization/domain/role-aggregate/repositories/roles-command.repository.interface';
import {
  AUDIT_LOG_COMMAND_REPOSITORY,
  type IAuditLogCommandRepository,
} from '../../../../audit-log/domain/audit-log-aggregate/repositories/audit-log-command.repository.interface';
import {
  type IUnitOfWork,
  UNIT_OF_WORK,
} from '../../../../../shared/unit-of-work/application/unit-of-work';
import { UnauthorizedException } from '../../../../../shared/domain/exception/unauthorized.exception';

@Injectable()
export class DeleteGenreUseCase {
  public constructor(
    @Inject(GENRES_COMMAND_REPOSITORY)
    private readonly repository: IGenresCommandRepository,

    @Inject(ROLES_COMMAND_REPOSITORY)
    private readonly roleRepository: IRolesCommandRepository,

    @Inject(AUDIT_LOG_COMMAND_REPOSITORY)
    private readonly auditLogRepository: IAuditLogCommandRepository,

    @Inject(UNIT_OF_WORK)
    private readonly unitOfWork: IUnitOfWork,
  ) {}

  public async execute(
    id: string,
    performedBy: string,
    roleId: string,
  ): Promise<void> {
    const role = await this.roleRepository.findOne(roleId);
    if (!role.hasPermission('genres.delete')) {
      throw new UnauthorizedException();
    }

    const genre = await this.repository.findOne(id);

    await this.unitOfWork.execute(async () => {
      await this.repository.delele(genre);

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
  }
}
