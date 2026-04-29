export interface ICustomersQueryRepository {
  findIdByEmail(email: string): Promise<string | null>;
}

export const CUSTOMERS_QUERY_REPOSITORY = 'ICustomersQueryRepository';
