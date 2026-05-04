import { refreshAccessToken } from '@/shared/auth/lib/refresh';
import { getAccessToken } from '@/shared/auth/lib/token-storage';
import { useEffect, useState } from 'react';
import { allCustomerService } from '../services/all-customer.service';

export default function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [errors, setErrors] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);
  const fetchCustomers = async () => {
    setLoading(true);
    try {
      if (!getAccessToken()) {
        await refreshAccessToken();
      }

      const data = await allCustomerService();
      const normalized = data.map((customer: Customer) => ({
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
      console.log(normalized);
    } catch (err: any) {
      setErrors(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return { customers, loading, errors, refetch: fetchCustomers };
}
