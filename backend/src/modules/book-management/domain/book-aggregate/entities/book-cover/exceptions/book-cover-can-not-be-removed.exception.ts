import { UnprocessableEntityDomainException } from '../../../../../../../shared/domain/exception/domain.exception';

export class BookCoverCanNotBeRemovedException extends UnprocessableEntityDomainException {
  public constructor() {
    super('Can not remove primary book cover', 'BOOK_COVER_CAN_NOT_BE_REMOVED');
  }
}
