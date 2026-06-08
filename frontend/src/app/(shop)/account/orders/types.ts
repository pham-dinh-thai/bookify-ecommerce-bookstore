export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'delivering'
  | 'delivered'
  | 'completed'
  | 'canceled'
  | 'refunded';

export type PaymentStatus =
  | 'unpaid'
  | 'pending'
  | 'paid'
  | 'failed'
  | 'refunded';

export type PaymentMethod = 'cash_on_delivery' | 'e_wallet';

export type MyOrderPreviewItem = {
  id: string;
  title: string;
  imageUrl: string | null;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

export type MyOrder = {
  id: string;
  orderCode: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  totalItems: number;
  totalAmount: number;
  previewItems: MyOrderPreviewItem[];
  createdAt: string;
};

export type MyOrderDetailItem = {
  id: string;
  productId: string;
  title: string;
  imageUrl: string | null;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

export type MyOrderDetail = {
  id: string;
  orderCode: string;
  userId: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  shippingAddress: string;
  phoneNumber: string;
  totalItems: number;
  totalAmount: number;
  items: MyOrderDetailItem[];
  createdAt: string;
  updatedAt: string;
};
