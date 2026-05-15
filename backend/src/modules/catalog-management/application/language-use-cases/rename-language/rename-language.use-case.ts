import { Inject, Injectable } from '@nestjs/common';
import {
  type ILanguagesCommandRepository,
  LANGUAGES_COMMAND_REPOSITORY,
} from '../../../domain/language-aggregate/repositories/languages-command.repository.interface';
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
import { IRenameLanguageRequest } from './rename-language.request';

/**
 * Renames an existing language.
 *
 * If the new name is identical to the current one, the operation is skipped entirely.
 * Every rename is recorded in the audit log with both the old and new name for traceability.
 * Cache is invalidated after a successful commit to ensure consistency.
 */
@Injectable()
export class RenameLanguageUseCase {
  public constructor(
    @Inject(LANGUAGES_COMMAND_REPOSITORY)
    private readonly languagesCommandRepository: ILanguagesCommandRepository,

    @Inject(AUDIT_LOG_COMMAND_REPOSITORY)
    private readonly auditLogCommandRepository: IAuditLogCommandRepository,

    @Inject(UNIT_OF_WORK)
    private readonly unitOfWork: IUnitOfWork,

    @Inject(CACHE_REPOSITORY)
    private readonly cacheRepository: ICacheRepository,
  ) {}

  public async execute(
    id: string,
    request: IRenameLanguageRequest,
    performedBy: string,
  ): Promise<void> {
    const language = await this.languagesCommandRepository.findOne(id);

    if (language.getName() === request.name) {
      return;
    }

    const { oldName, newName } = language.rename(request.name);

    await this.unitOfWork.execute(async () => {
      await this.languagesCommandRepository.save(language);

      await this.auditLogCommandRepository.write(
        'RENAME_LANGUAGE',
        performedBy,
        'language-management',
        'languages',
        { languageId: language.getId(), oldName, newName },
      );
    });

    await this.cacheRepository.delByPattern('languages:*');
  }
}
