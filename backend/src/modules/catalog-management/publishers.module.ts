import { Module } from '@nestjs/common';
import { PublishersController } from './presentation/publishers/publishers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PublisherTypeOrm } from './infrastructure/entities/publisher.entity';
import { UnitOfWorkModule } from '../../shared/unit-of-work/unit-of-work.module';
import { AuthenticationModule } from '../authentication/authentication.module';
import { SharedCacheModule } from '../../shared/cache/cache.module';
import { AuditLogModule } from '../audit-log/audit-log.module';
import { UuidModule } from '../../shared/uuid/uuid.module';
import { PUBLISHERS_QUERY_REPOSITORY } from './domain/publisher-aggregate/repositories/publishers-query.repository.interface';
import { TypeOrmPublishersQueryRepository } from './infrastructure/repositories/publishers/typeorm-publishers-query.repository';
import { FindPublishersUseCase } from './application/publisher-use-cases/find-publishers/find-publishers.use-case';
import { FindOnePublisherUseCase } from './application/publisher-use-cases/find-one-publisher/find-one-publisher.use-case';

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
    {
      provide: PUBLISHERS_QUERY_REPOSITORY,
      useClass: TypeOrmPublishersQueryRepository,
    },
  ],
  exports: [PUBLISHERS_QUERY_REPOSITORY],
})
export class PublishersModule {}
