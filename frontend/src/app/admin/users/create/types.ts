type CreateUserForm = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  gender: string;
  roleId: string;
};

type FormErrors = Partial<Record<keyof CreateUserForm, string>>;
