import { PublisherReadModel } from '../../../domain/publisher-aggregate/read-models/publisher.read-model';

export class FindPublishersResponse {
  public constructor(
    public readonly publishers: PublisherReadModel[],
    public readonly total: number,
  ) {}
}
