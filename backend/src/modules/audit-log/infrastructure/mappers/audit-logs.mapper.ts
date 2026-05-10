import { AuditLogReadModel } from '../../domain/audit-log-aggregate/read-models/audit-log.read-model';
import { AuditLogTypeOrm } from '../entities/typeorm-auditlog.entity';
import { FormatAuditMessage } from '../services/format-audit-message.service';

export class AuditLogsMapper {
  public static toReadModel(
    auditLogTypeOrm: AuditLogTypeOrm,
  ): AuditLogReadModel {
    return new AuditLogReadModel(
      auditLogTypeOrm.id,
      FormatAuditMessage.format(auditLogTypeOrm.action),
      auditLogTypeOrm.performedBy,
      auditLogTypeOrm.metadata,
      auditLogTypeOrm.createdAt,
    );
  }
}
