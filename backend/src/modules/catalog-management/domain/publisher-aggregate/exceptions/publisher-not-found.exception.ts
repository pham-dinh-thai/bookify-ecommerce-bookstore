import { DomainException } from '../../../../../shared/domain/exception/domain.exception';

export class PublisherNotFoundException extends DomainException {
  public constructor() {
    super('Publisher is not found', 'PUBLISHER_NOT_FOUND');
  }
}
