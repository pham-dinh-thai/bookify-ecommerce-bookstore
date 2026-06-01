import { Module } from '@nestjs/common';
import { PublishersController } from './presentation/publishers/publishers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PublisherTypeOrm } from './infrastructure/entities/publisher.entity';
import { UnitOfWorkModule } from '../../shared/modules/unit-of-work/unit-of-work.module';
import { AuthenticationModule } from '../authentication/authentication.module';
import { SharedCacheModule } from '../../shared/modules/cache/cache.module';
import { AuditLogModule } from '../audit-log/audit-log.module';
import { UuidModule } from '../../shared/modules/uuid/uuid.module';
import { PUBLISHERS_QUERY_REPOSITORY } from './domain/publisher-aggregate/repositories/publishers-query.repository.interface';
import { TypeOrmPublishersQueryRepository } from './infrastructure/repositories/publishers/typeorm-publishers-query.repository';
import { FindPublishersUseCase } from './application/publisher-use-cases/find-publishers/find-publishers.use-case';
import { FindOnePublisherUseCase } from './application/publisher-use-cases/find-one-publisher/find-one-publisher.use-case';
import { CreatePublisherUseCase } from './application/publisher-use-cases/create-publisher/create-publisher.use-case';
import { PUBLISHERS_COMMAND_REPOSITORY } from './domain/publisher-aggregate/repositories/publishers-command.repository.inerface';
import { TypeOrmPublishersCommandRepository } from './infrastructure/repositories/publishers/typeorm-publishers-command.repository';
import { RenamePublisherUseCase } from './application/publisher-use-cases/rename-publisher/rename-publisher.use-case';
import { DeletePublisherUseCase } from './application/publisher-use-cases/delete-publisher/delete-publisher.use-case';
import { PUBLISHER_EXISTS_CHECKER } from './domain/publisher-aggregate/services/publisher-exists-checker.service';
import { PublisherExistsChecker } from './infrastructure/services/publishers/publisher-exists-checker.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PublisherTypeOrm]),
    UnitOfWorkModule,
    AuthenticationModule,
    SharedCacheModule,
    AuditLogModule,
    UuidModule,
  ],
  controllers: [PublishersController],
  providers: [
    FindPublishersUseCase,
    FindOnePublisherUseCase,
    CreatePublisherUseCase,
    RenamePublisherUseCase,
    DeletePublisherUseCase,
    {
      provide: PUBLISHERS_QUERY_REPOSITORY,
      useClass: TypeOrmPublishersQueryRepository,
    },
    {
      provide: PUBLISHERS_COMMAND_REPOSITORY,
      useClass: TypeOrmPublishersCommandRepository,
    },
    {
      provide: PUBLISHER_EXISTS_CHECKER,
      useClass: PublisherExistsChecker,
    },
  ],
  exports: [
    PUBLISHERS_QUERY_REPOSITORY,
    PUBLISHERS_COMMAND_REPOSITORY,
    PUBLISHER_EXISTS_CHECKER,
  ],
})
export class PublishersModule {}
