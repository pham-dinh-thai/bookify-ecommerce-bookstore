import { Module } from '@nestjs/common';
import { LanguagesController } from './presentation/languages/languages.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LanguageTypeOrm } from './infrastructure/entities/language.entity';
import { UnitOfWorkModule } from '../../shared/unit-of-work/unit-of-work.module';
import { AuthenticationModule } from '../authentication/authentication.module';
import { SharedCacheModule } from '../../shared/cache/cache.module';
import { LANGUAGES_QUERY_REPOSITORY } from './domain/language-aggregate/repositories/languages-query.repository.interface';
import { TypeOrmLanguagesQueryRepository } from './infrastructure/repositories/languages/typeorm-languages-query.repository';
import { FindLanguagesUseCase } from './application/language-use-cases/find-languages/find-languages.use-case';
import { FindOneLanguageUseCase } from './application/language-use-cases/find-one-language/find-one-language.use-case';

@Module({
  imports: [
    TypeOrmModule.forFeature([LanguageTypeOrm]),
    UnitOfWorkModule,
    AuthenticationModule,
    SharedCacheModule,
  ],
  controllers: [LanguagesController],
  providers: [
    FindLanguagesUseCase,
    FindOneLanguageUseCase,
    {
      provide: LANGUAGES_QUERY_REPOSITORY,
      useClass: TypeOrmLanguagesQueryRepository,
    },
  ],
  exports: [LANGUAGES_QUERY_REPOSITORY],
})
export class LanguagesModule {}
