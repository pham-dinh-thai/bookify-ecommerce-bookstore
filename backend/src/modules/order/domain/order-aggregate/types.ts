import { FromPersistentOrderItemProps } from './entities/types';
import { OrderStatus } from './enums/order-status.enum';
import { PaymentMethod } from './enums/payment-method.enum';
import { PaymentStatus } from './enums/payment-status.enum';

export type CreateOrderProps = {
  id: string;
  userId: string;
  paymentMethod: PaymentMethod;
  shippingAddress: string;
  phoneNumber: string;
};

export type FromPersistentOrderProps = {
  id: string;
  userId: string;
  items: FromPersistentOrderItemProps[];
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  shippingAddress: string;
  phoneNumber: string;
};
