export interface IUnitOfWork {
  execute<T>(work: () => Promise<T>): Promise<T>;
}

export const UNIT_OF_WORK = 'IUnitOfWork';
