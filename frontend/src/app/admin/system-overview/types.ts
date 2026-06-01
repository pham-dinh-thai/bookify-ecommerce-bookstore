export type SystemTotals = {
  totalStaff: number;
  totalCustomers: number;
  totalGenres: number;
  totalPublishers: number;
  totalAuthors: number;
  totalLanguages: number;
  totalBooks: number;
  totalAuditLogs: number;
};

export type RecentActivity = {
  id: string;
  performedBy: string;
  message: string;
  metadata: Record<string, unknown> | null;
  createdAt: string;
};

export type AdminDashboard = {
  systemTotals: SystemTotals;
  recentActivities: RecentActivity[];
};
