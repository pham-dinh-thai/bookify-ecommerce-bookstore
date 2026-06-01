import { Injectable } from '@nestjs/common';
import {
  IAuditLogQueryRepository,
  TodayOrderActivityCounts,
} from '../../../domain/audit-log-aggregate/repositories/audit-log-query.repositoy.interface';
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

  public async countTodayOrderActivity(): Promise<TodayOrderActivityCounts> {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const startOfTomorrow = new Date(startOfToday);
    startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);

    const result = await this.repository
      .createQueryBuilder('audit_log')
      .select([
        `SUM(CASE WHEN audit_log.action = :placeOrder THEN 1 ELSE 0 END) AS placed`,
        `SUM(CASE WHEN audit_log.action = :updateOrderStatus
          AND JSON_UNQUOTE(JSON_EXTRACT(audit_log.metadata, '$.order.status')) = :confirmed
          THEN 1 ELSE 0 END) AS confirmed`,
        `SUM(CASE WHEN audit_log.action = :updateOrderStatus
          AND JSON_UNQUOTE(JSON_EXTRACT(audit_log.metadata, '$.order.status')) = :delivered
          THEN 1 ELSE 0 END) AS delivered`,
        `SUM(CASE WHEN audit_log.action = :updateOrderStatus
          AND JSON_UNQUOTE(JSON_EXTRACT(audit_log.metadata, '$.order.status')) = :completed
          THEN 1 ELSE 0 END) AS completed`,
        `SUM(CASE WHEN audit_log.action = :cancelOrder THEN 1 ELSE 0 END) AS canceled`,
      ])
      .where(
        'audit_log.createdAt >= :startOfToday AND audit_log.createdAt < :startOfTomorrow',
        { startOfToday, startOfTomorrow },
      )
      .setParameters({
        placeOrder: 'PLACE_ORDER',
        updateOrderStatus: 'UPDATE_ORDER_STATUS',
        cancelOrder: 'CANCEL_ORDER',
        confirmed: 'confirmed',
        delivered: 'delivered',
        completed: 'completed',
      })
      .getRawOne<{
        placed?: string | number | null;
        confirmed?: string | number | null;
        delivered?: string | number | null;
        completed?: string | number | null;
        canceled?: string | number | null;
      }>();

    return {
      placed: Number(result?.placed) || 0,
      confirmed: Number(result?.confirmed) || 0,
      delivered: Number(result?.delivered) || 0,
      completed: Number(result?.completed) || 0,
      canceled: Number(result?.canceled) || 0,
    };
  }
}
