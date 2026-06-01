'use client';

import {
  Users,
  BookUser,
  BookOpen,
  ScrollText,
  Building,
  UserCheck,
  Globe,
  Book,
} from 'lucide-react';
import useAdminDashboard from './hooks/use-admin-dashboard';
import RefreshButton from '@/shared/common/components/refresh-button';

export default function SystemOverview() {
  const { dashboard, loading, error, refetch } = useAdminDashboard();
  const totals = dashboard?.systemTotals;
  const recentActivities = dashboard?.recentActivities ?? [];

  const stats = [
    {
      label: 'Total Staff',
      value: totals?.totalStaff ?? 0,
      icon: Users,
      color: '#eef6ff',
      text: '#204877',
    },
    {
      label: 'Total Customers',
      value: totals?.totalCustomers ?? 0,
      icon: BookUser,
      color: '#f0faf4',
      text: '#2d6a4f',
    },
    {
      label: 'Total Genres',
      value: totals?.totalGenres ?? 0,
      icon: BookOpen,
      color: '#fff8e6',
      text: '#7a5800',
    },
    {
      label: 'Total Publishers',
      value: totals?.totalPublishers ?? 0,
      icon: Building,
      color: '#f3e8ff',
      text: '#6b21a8',
    },
    {
      label: 'Total Authors',
      value: totals?.totalAuthors ?? 0,
      icon: UserCheck,
      color: '#fef3c7',
      text: '#92400e',
    },
    {
      label: 'Total Languages',
      value: totals?.totalLanguages ?? 0,
      icon: Globe,
      color: '#dbeafe',
      text: '#1e40af',
    },
    {
      label: 'Total Books',
      value: totals?.totalBooks ?? 0,
      icon: Book,
      color: '#ecfdf5',
      text: '#065f46',
    },
    {
      label: 'Audit Logs',
      value: totals?.totalAuditLogs ?? 0,
      icon: ScrollText,
      color: '#fff1f1',
      text: '#b33a3a',
    },
  ];

  return (
    <div className="p-12">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <h2
          className="text-5xl font-extrabold tracking-tighter leading-[1.1]"
          style={{ color: '#2b352f' }}
        >
          <span className="italic" style={{ color: '#335b48' }}>
            System Overview
          </span>
        </h2>

        <RefreshButton onRefresh={refetch} loading={loading} />
      </div>

      {error ? (
        <div className="mb-6 rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error.message}
        </div>
      ) : null}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl p-6 flex flex-col gap-3"
            style={{ backgroundColor: stat.color }}
          >
            <div className="flex items-center justify-between">
              <span
                className="text-sm font-semibold"
                style={{ color: stat.text }}
              >
                {stat.label}
              </span>
              <stat.icon className="w-5 h-5" style={{ color: stat.text }} />
            </div>
            <p className="text-3xl font-extrabold" style={{ color: stat.text }}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-3xl border border-[#e8ede9] p-6 shadow-sm">
        <h3 className="text-sm font-bold uppercase tracking-widest text-[#6d7f72] mb-6">
          Recent Activity
        </h3>
        <div className="divide-y divide-[#eef2ea]">
          {recentActivities.length > 0 ? (
            recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="py-4 flex items-start justify-between gap-4"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1 w-2 h-2 rounded-full bg-[#2d6a4f] shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-[#1c3725]">
                      {activity.message}
                    </p>
                    <p className="text-xs text-[#6d7f72] mt-1">
                      {activity.performedBy}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-[#8c9b8d] shrink-0">
                  {activity.createdAt}
                </span>
              </div>
            ))
          ) : (
            <p className="py-4 text-sm text-[#5a6d60]">
              {loading ? 'Loading activity...' : 'No recent activity.'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
