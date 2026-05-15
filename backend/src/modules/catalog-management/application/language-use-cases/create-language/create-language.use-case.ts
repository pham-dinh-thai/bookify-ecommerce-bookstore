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
import { ICreateLanguageRequest } from './create-language.request';
import { Language } from '../../../domain/language-aggregate/language.aggregate';
import {
  type ILanguageExistsChecker,
  LANGUAGE_EXISTS_CHECKER,
} from '../../../domain/language-aggregate/services/language-exists-checker.service';
import { LanguageIdDuplicateException } from '../../../domain/language-aggregate/exceptions/language-id-duplicate.exception';

/**
 * Creates a new language.
 *
 * Every creation is recorded in the audit log for traceability.
 * Cache is invalidated after a successful commit to ensure consistency.
 */
@Injectable()
export class CreateLanguageUseCase {
  public constructor(
    @Inject(LANGUAGES_COMMAND_REPOSITORY)
    private readonly languagesCommandRepository: ILanguagesCommandRepository,

    @Inject(AUDIT_LOG_COMMAND_REPOSITORY)
    private readonly auditLogCommandRepository: IAuditLogCommandRepository,

    @Inject(UNIT_OF_WORK)
    private readonly unitOfWork: IUnitOfWork,

    @Inject(CACHE_REPOSITORY)
    private readonly cacheRepository: ICacheRepository,

    @Inject(LANGUAGE_EXISTS_CHECKER)
    private readonly languageExistsChecker: ILanguageExistsChecker,
  ) {}

  public async execute(
    request: ICreateLanguageRequest,
    performedBy: string,
  ): Promise<void> {
    const isExists = await this.languageExistsChecker.isExists(request.id);
    if (isExists) {
      throw new LanguageIdDuplicateException();
    }

    const language = Language.create(request.id, request.name);

    await this.unitOfWork.execute(async () => {
      await this.languagesCommandRepository.save(language);

      await this.auditLogCommandRepository.write(
        'CREATE_LANGUAGE',
        performedBy,
        'language-management',
        'languages',
        { languageId: language.getId(), languageName: language.getName() },
      );
    });

    await this.cacheRepository.delByPattern('languages:*');
  }
}
