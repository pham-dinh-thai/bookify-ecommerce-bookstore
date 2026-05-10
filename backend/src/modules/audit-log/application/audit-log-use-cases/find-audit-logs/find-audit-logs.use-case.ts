import { Inject, Injectable } from '@nestjs/common';
import {
  AUDIT_LOG_QUERY_REPOSITORY,
  type IAuditLogQueryRepository,
} from '../../../domain/audit-log-aggregate/repositories/audit-log-query.repositoy.interface';
import {
  CACHE_REPOSITORY,
  type ICacheRepository,
} from '../../../../../shared/cache/domain/cache.repository.interface';
import { FindAuditLogsResponse } from './find-audit-logs.response';
import {
  AUDIT_LOG_CACHE_KEYS,
  AUDIT_LOG_CACHE_TTL,
} from '../audit-log-cache.constants';

@Injectable()
export class FindAuditLogsUseCase {
  public constructor(
    @Inject(AUDIT_LOG_QUERY_REPOSITORY)
    private readonly repository: IAuditLogQueryRepository,

    @Inject(CACHE_REPOSITORY)
    private readonly cache: ICacheRepository,
  ) {}

  public async execute(
    page: number,
    limit: number,
    search?: string,
  ): Promise<FindAuditLogsResponse> {
    const cacheKey = AUDIT_LOG_CACHE_KEYS.PAGE(page, limit, search);

    const cached = await this.cache.get<FindAuditLogsResponse>(cacheKey);
    if (cached) {
      return cached;
    }

    const auditLogs = await this.repository.findAll(page, limit, search);
    const total = await this.repository.count(search);

    const response = new FindAuditLogsResponse(auditLogs, total);

    await this.cache.set(cacheKey, response, AUDIT_LOG_CACHE_TTL.ALL);

    return response;
  }
}
