import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LanguageTypeOrm } from './infrastructure/entities/language.entity';
import { LanguagesController } from './presentation/languages/languages.controller';
import { UnitOfWorkModule } from '../../shared/modules/unit-of-work/unit-of-work.module';
import { AuthenticationModule } from '../authentication/authentication.module';
import { SharedCacheModule } from '../../shared/modules/cache/cache.module';
import { LANGUAGES_QUERY_REPOSITORY } from './domain/language-aggregate/repositories/languages-query.repository.interface';
import { TypeOrmLanguagesQueryRepository } from './infrastructure/repositories/languages/typeorm-languages-query.repository';
import { FindLanguagesUseCase } from './application/language-use-cases/find-languages/find-languages.use-case';
import { FindOneLanguageUseCase } from './application/language-use-cases/find-one-language/find-one-language.use-case';
import { CreateLanguageUseCase } from './application/language-use-cases/create-language/create-language.use-case';
import { LANGUAGES_COMMAND_REPOSITORY } from './domain/language-aggregate/repositories/languages-command.repository.interface';
import { TypeOrmLanguagesCommandRepository } from './infrastructure/repositories/languages/typeorm-languages-command.repository';
import { AuditLogModule } from '../audit-log/audit-log.module';
import { RenameLanguageUseCase } from './application/language-use-cases/rename-language/rename-language.use-case';
import { DeleteLanguageUseCase } from './application/language-use-cases/delete-language/delete-language.use-case';
import { LANGUAGE_EXISTS_CHECKER } from './domain/language-aggregate/services/language-exists-checker.service';
import { LanguageExistsChecker } from './infrastructure/services/languages/language-exists-checker.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([LanguageTypeOrm]),
    UnitOfWorkModule,
    AuthenticationModule,
    SharedCacheModule,
    AuditLogModule,
  ],
  controllers: [LanguagesController],
  providers: [
    FindLanguagesUseCase,
    FindOneLanguageUseCase,
    CreateLanguageUseCase,
    RenameLanguageUseCase,
    DeleteLanguageUseCase,
    {
      provide: LANGUAGES_QUERY_REPOSITORY,
      useClass: TypeOrmLanguagesQueryRepository,
    },
    {
      provide: LANGUAGES_COMMAND_REPOSITORY,
      useClass: TypeOrmLanguagesCommandRepository,
    },
    {
      provide: LANGUAGE_EXISTS_CHECKER,
      useClass: LanguageExistsChecker,
    },
  ],
  exports: [
    LANGUAGES_QUERY_REPOSITORY,
    LANGUAGES_COMMAND_REPOSITORY,
    LANGUAGE_EXISTS_CHECKER,
  ],
})
export class LanguagesModule {}
