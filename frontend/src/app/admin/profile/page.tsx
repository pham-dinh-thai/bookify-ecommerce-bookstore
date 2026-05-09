'use client';

import { useAuth } from '@/shared/auth/hooks/use-auth';
import { User, Mail, Shield } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="p-12">
        <div className="text-center">
          <p className="text-gray-500">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-12">
      <h2
        className="text-5xl font-extrabold tracking-tighter mb-8 leading-[1.1]"
        style={{ color: '#2b352f' }}
      >
        <span className="italic" style={{ color: '#335b48' }}>
          My Account
        </span>
      </h2>

      <div className="max-w-2xl">
        <div className="bg-white rounded-3xl border border-[#e8ede9] p-8 shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-[#2d6a4f] rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-[#1c3725]">User Name</h3>
              <p className="text-gray-600">Administrator</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-[#6d7f72]" />
              <span className="text-[#1c3725]">{user.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-[#6d7f72]" />
              <span className="text-[#1c3725]">Role: Admin</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
