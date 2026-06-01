import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLogTypeOrm } from './infrastructure/entities/typeorm-auditlog.entity';
import { UuidModule } from '../../shared/modules/uuid/uuid.module';
import { AUDIT_LOG_COMMAND_REPOSITORY } from './domain/audit-log-aggregate/repositories/audit-log-command.repository.interface';
import { TypeOrmAuditLogCommandRepository } from './infrastructure/repositories/audit-log/typeorm-audit-log-command.repository';
import { UnitOfWorkModule } from '../../shared/modules/unit-of-work/unit-of-work.module';
import { AuditLogsController } from './presentation/audit-logs/audit-logs.controller';
import { AUDIT_LOG_QUERY_REPOSITORY } from './domain/audit-log-aggregate/repositories/audit-log-query.repositoy.interface';
import { TypeormAuditlogQueryRepository } from './infrastructure/repositories/audit-log/typeorm-audit-log-query.repository';
import { FindAuditLogsUseCase } from './application/audit-log-use-cases/find-audit-logs/find-audit-logs.use-case';
import { SharedCacheModule } from '../../shared/modules/cache/cache.module';
import { FindTotalAuditLogUseCase } from './application/audit-log-use-cases/find-total-audit-log/find-total-audit-log.use-case';
import { AuthenticationModule } from '../authentication/authentication.module';
import { FindRecentActivityUseCase } from './application/audit-log-use-cases/find-recent-activity/find-recent-activity.use-case';

@Module({
  imports: [
    TypeOrmModule.forFeature([AuditLogTypeOrm]),
    UuidModule,
    UnitOfWorkModule,
    SharedCacheModule,
    AuthenticationModule,
  ],
  providers: [
    FindAuditLogsUseCase,
    FindTotalAuditLogUseCase,
    FindRecentActivityUseCase,
    {
      provide: AUDIT_LOG_COMMAND_REPOSITORY,
      useClass: TypeOrmAuditLogCommandRepository,
    },
    {
      provide: AUDIT_LOG_QUERY_REPOSITORY,
      useClass: TypeormAuditlogQueryRepository,
    },
  ],
  exports: [AUDIT_LOG_COMMAND_REPOSITORY, AUDIT_LOG_QUERY_REPOSITORY],
  controllers: [AuditLogsController],
})
export class AuditLogModule {}
