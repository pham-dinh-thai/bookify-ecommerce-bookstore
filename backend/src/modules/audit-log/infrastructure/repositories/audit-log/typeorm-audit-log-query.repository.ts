import { Injectable } from '@nestjs/common';
import { IAuditLogQueryRepository } from '../../../domain/audit-log-aggregate/repositories/audit-log-query.repositoy.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { AuditLogTypeOrm } from '../../entities/typeorm-auditlog.entity';
import { Repository } from 'typeorm';
import { AuditLogReadModel } from '../../../domain/audit-log-aggregate/read-models/audit-log.read-model';

@Injectable()
export class TypeormAuditlogQueryRepository implements IAuditLogQueryRepository {
  public constructor(
    @InjectRepository(AuditLogTypeOrm)
    private readonly repository: Repository<AuditLogTypeOrm>,
  ) {}

  public async findAll(): Promise<AuditLogReadModel[]> {
    const auditLogs = await this.repository.find({
      order: {
        createdAt: 'DESC',
      },
    });

    return auditLogs
      ? auditLogs.map(
          (auditLog) =>
            new AuditLogReadModel(
              auditLog.id,
              auditLog.action,
              auditLog.performedBy,
              auditLog.metadata,
              auditLog.createdAt,
            ),
        )
      : [];
  }
}
