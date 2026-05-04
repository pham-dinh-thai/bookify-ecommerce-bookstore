type Address = {
  id: string;
  street: string;
  provinceName: string;
  wardName: string;
  isDefault: boolean;
};

type Customer = {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  addresses: Address[];
  isActive: boolean;
  // normalized fields
  name?: string;
  address?: string;
  status?: string;
};
