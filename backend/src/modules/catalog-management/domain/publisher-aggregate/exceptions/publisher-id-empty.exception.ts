import { DomainException } from '../../../../../shared/domain/exception/domain.exception';

export class PublisherIdEmptyException extends DomainException {
  public constructor() {
    super('Publisher id is required', 'PUBLISHER_ID_EMPTY');
  }
}
