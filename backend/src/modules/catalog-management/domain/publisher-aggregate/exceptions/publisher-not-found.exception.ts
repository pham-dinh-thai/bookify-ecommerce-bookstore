import { NotFoundDomainException } from '../../../../../shared/domain/exception/domain.exception';

export class PublisherNotFoundException extends NotFoundDomainException {
  public constructor() {
    super('Publisher is not found', 'PUBLISHER_NOT_FOUND');
  }
}
