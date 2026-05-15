import { Inject, Injectable } from '@nestjs/common';
import {
  type IPublishersQueryRepository,
  PUBLISHERS_QUERY_REPOSITORY,
} from '../../../domain/publisher-aggregate/repositories/publishers-query.repository.interface';

/**
 * Returns the total number of publishers in the system.
 */
@Injectable()
export class FindTotalPublisherUseCase {
  public constructor(
    @Inject(PUBLISHERS_QUERY_REPOSITORY)
    private readonly publishersQueryRepository: IPublishersQueryRepository,
  ) {}

  public async execute(): Promise<number> {
    const total = await this.publishersQueryRepository.count();

    return total;
  }
}
