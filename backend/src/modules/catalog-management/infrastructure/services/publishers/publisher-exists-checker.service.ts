import { Inject } from '@nestjs/common';
import { IPublisherExistsChecker } from '../../../domain/publisher-aggregate/services/publisher-exists-checker.service';
import {
  type IPublishersQueryRepository,
  PUBLISHERS_QUERY_REPOSITORY,
} from '../../../domain/publisher-aggregate/repositories/publishers-query.repository.interface';
import { PublisherNotFoundException } from '../../../domain/publisher-aggregate/exceptions/publisher-not-found.exception';

export class PublisherExistsChecker implements IPublisherExistsChecker {
  public constructor(
    @Inject(PUBLISHERS_QUERY_REPOSITORY)
    private readonly publishersQueryRepository: IPublishersQueryRepository,
  ) {}

  public async isExists(id: string): Promise<boolean> {
    const publisher = await this.publishersQueryRepository.findOne(id);

    return !!publisher;
  }

  public async existsOrThrow(id: string): Promise<void> {
    const isExists = await this.publishersQueryRepository.findOne(id);

    if (!isExists) {
      throw new PublisherNotFoundException();
    }
  }
}
