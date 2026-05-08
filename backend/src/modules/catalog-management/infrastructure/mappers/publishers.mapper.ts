import { Publisher } from '../../domain/publisher-aggregate/publisher.aggregate';
import { PublisherReadModel } from '../../domain/publisher-aggregate/read-models/publisher.read-model';
import { PublisherTypeOrm } from '../entities/publisher.entity';

export class PublishersMapper {
  public static toDomain(publisherTypeOrm: PublisherTypeOrm): Publisher {
    return Publisher.fromPersistent(publisherTypeOrm.id, publisherTypeOrm.name);
  }

  public static toTypeOrm(publisher: Publisher): PublisherTypeOrm {
    const publisherTypeOrm = new PublisherTypeOrm();

    publisherTypeOrm.id = publisher.getId();
    publisherTypeOrm.name = publisher.getName();

    return publisherTypeOrm;
  }

  public static toReadModel(
    publisherTypeOrm: PublisherTypeOrm,
  ): PublisherReadModel {
    return new PublisherReadModel(publisherTypeOrm.id, publisherTypeOrm.name);
  }
}
