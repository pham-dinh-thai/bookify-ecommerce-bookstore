import { Inject, Injectable } from '@nestjs/common';
import {
  type IPublishersQueryRepository,
  PUBLISHERS_QUERY_REPOSITORY,
} from '../../../domain/publisher-aggregate/repositories/publishers-query.repository.interface';
import { PublisherReadModel } from '../../../domain/publisher-aggregate/read-models/publisher.read-model';

/**
 * Retrieves a single publisher by ID, or null if not found.
 */
@Injectable()
export class FindOnePublisherUseCase {
  public constructor(
    @Inject(PUBLISHERS_QUERY_REPOSITORY)
    private readonly publishersQueryRepository: IPublishersQueryRepository,
  ) {}

  public async execute(id: string): Promise<PublisherReadModel | null> {
    const publisher = await this.publishersQueryRepository.findOne(id);

    return publisher;
  }
}
