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

  public async findAll(
    page: number,
    limit: number,
    search?: string,
  ): Promise<AuditLogReadModel[]> {
    const query = this.repository.createQueryBuilder('audit_log');

    if (search) {
      query.where('audit_log.action LIKE :search', { search: `%${search}%` });
    }

    const auditLogs = await query
      .orderBy('audit_log.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return auditLogs.map(
      (auditLog) =>
        new AuditLogReadModel(
          auditLog.id,
          auditLog.action,
          auditLog.performedBy,
          auditLog.metadata,
          auditLog.createdAt,
        ),
    );
  }

  public async recentActivity(): Promise<AuditLogReadModel[]> {
    const auditLogs = await this.repository.find({
      order: {
        createdAt: 'DESC',
      },
      take: 5,
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

  public async count(search?: string): Promise<number> {
    const query = this.repository.createQueryBuilder('audit_log');

    if (search) {
      query.where('audit_log.action LIKE :search', { search: `%${search}%` });
    }

    return await query.getCount();
  }
}
