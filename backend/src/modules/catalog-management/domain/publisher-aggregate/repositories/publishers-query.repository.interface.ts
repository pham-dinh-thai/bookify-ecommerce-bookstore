import { PublisherReadModel } from '../read-models/publisher.read-model';

export interface IPublishersQueryRepository {
  findAll(
    page: number,
    limit: number,
    search?: string,
  ): Promise<PublisherReadModel[]>;

  findOne(id: string): Promise<PublisherReadModel | null>;

  count(search?: string): Promise<number>;
}

export const PUBLISHERS_QUERY_REPOSITORY = 'IPublishersQueryRepository';
