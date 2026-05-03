type EditUserForm = {
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  roleId: string;
};

type EditFormErrors = Partial<Record<keyof EditUserForm, string>>;
