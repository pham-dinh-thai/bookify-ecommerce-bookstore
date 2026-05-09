import { PublisherReadModel } from '../read-models/publisher.read-model';

export interface IPublishersQueryRepository {
  findAll(): Promise<PublisherReadModel[]>;

  findOne(id: string): Promise<PublisherReadModel | null>;

  count(): Promise<number>;
}

export const PUBLISHERS_QUERY_REPOSITORY = 'IPublishersQueryRepository';
