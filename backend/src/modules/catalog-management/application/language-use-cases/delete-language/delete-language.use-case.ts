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
} from '../../../../../shared/unit-of-work/application/unit-of-work';
import {
  CACHE_REPOSITORY,
  type ICacheRepository,
} from '../../../../../shared/cache/domain/cache.repository.interface';
import { LANGUAGE_CACHE_KEYS } from '../language-cache.constants';

@Injectable()
export class DeleteLanguageUseCase {
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

  public async execute(id: string, performedBy: string): Promise<void> {
    const language = await this.languagesCommandRepository.findOne(id);

    await this.unitOfWork.execute(async () => {
      await this.languagesCommandRepository.delete(language);

      await this.auditLogCommandRepository.write(
        'DELETE_LANGUAGE',
        performedBy,
        'language-management',
        'languages',
        { languageId: language.getId() },
      );
    });

    await this.cacheRepository.del(LANGUAGE_CACHE_KEYS.ALL);
  }
}
