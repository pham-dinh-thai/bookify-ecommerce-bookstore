'use client';

import { Users, BookUser, BookOpen, ScrollText } from 'lucide-react';
import totalStaffService from './services/total-staff.service';
import totalCustomerService from './services/total-customer.service';
import { useEffect, useState } from 'react';
import totalGenreService from './services/total-genre.service';
import totalAuditLogService from './services/total-audit-log.service';

const recentActivities = [
  {
    message: 'Created genre "Nordic Noir"',
    performedBy: 'admin@bookify.dev',
    createdAt: '2026-05-06 08:12',
  },
  {
    message: 'Deactivated user "john@example.com"',
    performedBy: 'admin@bookify.dev',
    createdAt: '2026-05-06 07:55',
  },
  {
    message: 'Renamed genre "Horror" to "Magic"',
    performedBy: 'admin@bookify.dev',
    createdAt: '2026-05-05 23:41',
  },
  {
    message: 'Created user "jane@bookify.dev"',
    performedBy: 'admin@bookify.dev',
    createdAt: '2026-05-05 22:10',
  },
  {
    message: 'Deleted genre "Sad"',
    performedBy: 'admin@bookify.dev',
    createdAt: '2026-05-05 21:03',
  },
];

export default function SystemOverview() {
  const [totalStaff, setTotalStaff] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [totalGenres, setTotalGenres] = useState(0);
  const [totalAuditLogs, setTotalAuditLogs] = useState(0);

  useEffect(() => {
    totalStaffService().then(setTotalStaff).catch(console.error);
    totalCustomerService().then(setTotalCustomers).catch(console.error);
    totalGenreService().then(setTotalGenres).catch(console.error);
    totalAuditLogService().then(setTotalAuditLogs).catch(console.error);
  }, []);

  const stats = [
    {
      label: 'Total Staff',
      value: totalStaff,
      icon: Users,
      color: '#eef6ff',
      text: '#204877',
    },
    {
      label: 'Total Customers',
      value: totalCustomers,
      icon: BookUser,
      color: '#f0faf4',
      text: '#2d6a4f',
    },
    {
      label: 'Total Genres',
      value: totalGenres,
      icon: BookOpen,
      color: '#fff8e6',
      text: '#7a5800',
    },
    {
      label: 'Audit Logs',
      value: totalAuditLogs,
      icon: ScrollText,
      color: '#fff1f1',
      text: '#b33a3a',
    },
  ];

  return (
    <div className="p-12">
      <h2
        className="text-5xl font-extrabold tracking-tighter mb-8 leading-[1.1]"
        style={{ color: '#2b352f' }}
      >
        <span className="italic" style={{ color: '#335b48' }}>
          System Overview
        </span>
      </h2>

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
          {recentActivities.map((activity, index) => (
            <div
              key={index}
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
          ))}
        </div>
      </div>
    </div>
  );
}
