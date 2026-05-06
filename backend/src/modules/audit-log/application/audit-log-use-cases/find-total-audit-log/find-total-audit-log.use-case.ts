import { Inject, Injectable } from '@nestjs/common';
import {
  AUDIT_LOG_QUERY_REPOSITORY,
  type IAuditLogQueryRepository,
} from '../../../domain/audit-log-aggregate/repositories/audit-log-query.repositoy.interface';

@Injectable()
export class FindTotalAuditLogUseCase {
  public constructor(
    @Inject(AUDIT_LOG_QUERY_REPOSITORY)
    private readonly repository: IAuditLogQueryRepository,
  ) {}

  public async execute(): Promise<number> {
    const total = await this.repository.count();

    return total;
  }
}
