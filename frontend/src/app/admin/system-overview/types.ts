export type RecentActivity = {
  id: string;
  performedBy: string;
  message: string;
  metadata: Record<string, any> | null;
  createdAt: string;
};
