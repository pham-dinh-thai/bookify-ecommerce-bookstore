export type RegisterApiRequest = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  passwordConfirmation: string;
};

export async function registerApi(payload: RegisterApiRequest): Promise<void> {}
