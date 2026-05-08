import { Publisher } from '../publisher.aggregate';

export interface IPublishersCommandRepository {
  findOne(id: string): Promise<Publisher>;

  save(publisher: Publisher): Promise<void>;

  delete(publisher: Publisher): Promise<void>;
}

export const PUBLISHERS_COMMAND_REPOSITORY = 'IPublishersCommandRepository';
