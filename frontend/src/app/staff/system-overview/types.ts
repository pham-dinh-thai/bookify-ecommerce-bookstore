import { OrderStatus, PaymentStatus } from '../orders/types';

export type OrderWorkload = {
  pendingOrders: number;
  confirmedOrders: number;
  deliveringOrders: number;
  unpaidCodOrders: number;
  unpaidCompleteCodOrders: number;
};

export type TodayActivity = {
  ordersPlacedToday: number;
  ordersConfirmedToday: number;
  ordersDeliveredToday: number;
  ordersCompletedToday: number;
  ordersCanceledToday: number;
};

export type LowStockBook = {
  id: string;
  isbn: string;
  title: string;
  quantity: number;
};

export type StockAlerts = {
  outOfStockCount: number;
  lowStockCount: number;
  lowStockThreshold: number;
  lowStockBooks: LowStockBook[];
};

export type RecentOrder = {
  id: string;
  orderCode: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  totalAmount: number;
  createdAt: string;
  detailPath: string;
};

export type QuickAction = {
  key: string;
  label: string;
  path: string;
};

export type StaffDashboard = {
  orderWorkload: OrderWorkload;
  todayActivity: TodayActivity;
  stockAlerts: StockAlerts;
  recentOrders: RecentOrder[];
  quickActions: QuickAction[];
};
