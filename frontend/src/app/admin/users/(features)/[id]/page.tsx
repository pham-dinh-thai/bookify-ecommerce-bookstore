'use client';

import { use } from 'react';
import useEditUser from './hooks/use-edit-user';
import EditUserHeader from './ui/edit-user-header';
import EditUserForm from './ui/edit-user-form';
import UserFormNavigate from '../../components/user-form-navigate';

export default function EditUser({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return (
    <div className="px-12 py-8">
      <div className="max-w-3xl mx-auto">
        <UserFormNavigate label="Edit User" />

        <div
          className="rounded-[2rem] p-10 lg:p-16"
          style={{
            backgroundColor: '#ffffff',
            boxShadow: '0px 40px 80px rgba(43,53,47,0.06)',
          }}
        >
          <EditUserHeader />

          <EditUserForm id={id} />
        </div>
      </div>
    </div>
  );
}
