type EditCustomerForm = {
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  roleId: string;
};

type EditCustomerFormErrors = Partial<Record<keyof EditCustomerForm, string>>;
