export interface IPublisherExistsChecker {
  isExists(id: string): Promise<boolean>;

  existsOrThrow(id: string): Promise<void>;
}

export const PUBLISHER_EXISTS_CHECKER = 'IPublisherExistsChecker';
