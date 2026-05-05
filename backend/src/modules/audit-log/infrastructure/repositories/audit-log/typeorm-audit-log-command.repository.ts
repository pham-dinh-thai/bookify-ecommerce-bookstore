import { Inject, Injectable } from '@nestjs/common';
import { TypeOrmUnitOfWork } from '../../../../../shared/unit-of-work/infrastructure/typeorm-unit-of-work';
import { AuditLogTypeOrm } from '../../entities/typeorm-auditlog.entity';
import { IAuditLogCommandRepository } from '../../../domain/audit-log-aggregate/repositories/audit-log-command.repository.interface';
import {
  CACHE_REPOSITORY,
  type ICacheRepository,
} from '../../../../../shared/cache/domain/cache.repository.interface';

@Injectable()
export class TypeOrmAuditLogCommandRepository implements IAuditLogCommandRepository {
  public constructor(
    private readonly unitOfWork: TypeOrmUnitOfWork,

    @Inject(CACHE_REPOSITORY)
    private readonly cache: ICacheRepository,
  ) {}

  public async write(
    action: string,
    performedBy: string,
    module: string,
    resource: string,
    metadata: object = {},
  ): Promise<void> {
    await this.unitOfWork.getManager().save(AuditLogTypeOrm, {
      action,
      module,
      resource,
      performedBy,
      metadata,
    });

    await this.cache.del('auditLogs');
  }
}
