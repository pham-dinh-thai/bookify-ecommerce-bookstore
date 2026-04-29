export interface IUsersCommandRepository {
  updateGender(userId: string, gender: string): Promise<void>;
}

export const CUSTOMER_MODULE_USERS_COMMAND_REPOSITORY =
  'CUSTOMER_MODULE_USERS_COMMAND_REPOSITORY';
