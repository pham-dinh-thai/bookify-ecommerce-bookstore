import { FromPersistentOrderItemProps } from './entities/types';

export type CreateOrderProps = {
  id: string;
  userId: string;
  status;
};

export type FromPersistentOrderProps = {
  id: string;
  userId: string;
  items: FromPersistentOrderItemProps[];
  status;
};
