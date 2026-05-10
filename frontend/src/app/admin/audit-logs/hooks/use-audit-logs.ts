import { refreshAccessToken } from '@/shared/auth/lib/refresh';
import { getAccessToken } from '@/shared/auth/lib/token-storage';
import { useEffect, useState } from 'react';
import { AuditLog } from '../types';
import { allAuditLogsService } from '../services/all-audit-logs.service';

export default function useAuditLogs(
  page: number,
  limit: number,
  search: string,
) {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [errors, setErrors] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  const fetchAuditLogs = async () => {
    setLoading(true);
    try {
      if (!getAccessToken()) await refreshAccessToken();
      const data = await allAuditLogsService(page, limit, search);

      setAuditLogs(data.auditLogs);
      setTotal(data.total);
    } catch (err: any) {
      setErrors(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditLogs();
  }, [page, limit, search]);

  return { auditLogs, total, loading, errors, refetch: fetchAuditLogs };
}
