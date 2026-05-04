'use client';

import { use } from 'react';
import CustomerFormNavigate from '../(customer-management)/components/customer-form-navigate';
import EditCustomerHeader from './ui/edit-customer-header';
import EditCustomerForm from './ui/edit-customer-form';

export default function EditCustomer({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = use(params);

  return (
    <div className="px-12 py-8">
      <div className="max-w-3xl mx-auto">
        <CustomerFormNavigate label="Edit Customer" />

        <div
          className="rounded-[2rem] p-10 lg:p-16"
          style={{
            backgroundColor: '#ffffff',
            boxShadow: '0px 40px 80px rgba(43,53,47,0.06)',
          }}
        >
          <EditCustomerHeader />

          <EditCustomerForm userId={userId} />
        </div>
      </div>
    </div>
  );
}
