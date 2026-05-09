import { BadRequestDomainException } from '../../../../../shared/domain/exception/domain.exception';

export class PublisherIdEmptyException extends BadRequestDomainException {
  public constructor() {
    super('Publisher id is required', 'PUBLISHER_ID_EMPTY');
  }
}
