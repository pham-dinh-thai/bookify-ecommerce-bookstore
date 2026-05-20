import { FromPersistentCartItemProps } from './entities/types';

export type CreateCartProps = {
  id: string;
  userId: string;
};

export type FromPersistentCartProps = {
  id: string;
  userId: string;
  items: FromPersistentCartItemProps[];
};
