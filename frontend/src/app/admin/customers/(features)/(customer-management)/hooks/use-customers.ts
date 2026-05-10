import { refreshAccessToken } from '@/shared/auth/lib/refresh';
import { getAccessToken } from '@/shared/auth/lib/token-storage';
import { useEffect, useState } from 'react';
import { allCustomerService } from '../services/all-customer.service';

export default function useCustomers(
  page: number,
  limit: number,
  isActive?: boolean,
  search?: string,
) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [total, setTotal] = useState(0);
  const [errors, setErrors] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);
  const fetchCustomers = async () => {
    setLoading(true);
    try {
      if (!getAccessToken()) {
        await refreshAccessToken();
      }

      const data = await allCustomerService(page, limit, isActive, search);
      const normalized = data.customers.map((customer: Customer) => ({
        ...customer,
        name: `${customer.firstName ?? ''} ${customer.lastName ?? ''}`.trim(),
        gender: !customer.gender
          ? 'N/A'
          : customer.gender.charAt(0).toUpperCase() +
            customer.gender.slice(1).toLowerCase(),
        status: customer.isActive ? 'Active' : 'Inactive',
        address: (() => {
          const defaultAddr =
            customer.addresses?.find((a: any) => a.isDefault) ??
            customer.addresses?.[0];
          if (!defaultAddr) return 'N/A';
          return [
            defaultAddr.street,
            defaultAddr.wardName,
            defaultAddr.provinceName,
          ]
            .filter(Boolean)
            .join(', ');
        })(),
      }));

      setCustomers(normalized);
      setTotal(data.total);
    } catch (err: any) {
      setErrors(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [page, limit, isActive, search]);

  return { customers, total, loading, errors, refetch: fetchCustomers };
}
