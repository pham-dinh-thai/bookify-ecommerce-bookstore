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

export type TopGenre = {
  genreId: string;
  genreName: string;
  unitsSold: number;
  revenue: number;
};

export type TopAuthor = {
  authorId: string;
  authorName: string;
  unitsSold: number;
  revenue: number;
};

export type TopPublisher = {
  publisherId: string;
  publisherName: string;
  unitsSold: number;
  revenue: number;
};

export type TopLanguage = {
  languageId: string;
  languageName: string;
  unitsSold: number;
  revenue: number;
};

export type AdminDashboard = {
  systemTotals: SystemTotals;
  recentActivities: RecentActivity[];
  topGenres: TopGenre[];
  topAuthors: TopAuthor[];
  topPublishers: TopPublisher[];
  topLanguages: TopLanguage[];
};
