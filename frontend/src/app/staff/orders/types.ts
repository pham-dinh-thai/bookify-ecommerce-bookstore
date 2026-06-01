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

export type PaymentMethod =
  | 'cash_on_delivery'
  | 'bank_transfer'
  | 'card'
  | 'e_wallet';

export type Order = {
  id: string;
  orderCode: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  totalAmount: number;
  totalItems: number;
  createdAt: string;
};

export type OrderDetailItem = {
  id: string;
  productId: string;
  title: string;
  imageUrl: string | null;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

export type OrderDetail = Order & {
  userId: string;
  shippingAddress: string;
  phoneNumber: string;
  items: OrderDetailItem[];
  updatedAt: string;
};
