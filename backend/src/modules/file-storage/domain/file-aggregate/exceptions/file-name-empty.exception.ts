import { BadRequestDomainException } from '../../../../../shared/domain/exception/domain.exception';

export class FileNameEmptyException extends BadRequestDomainException {
  public constructor() {
    super('File name cannot be empty', 'FILE_NAME_EMPTY');
  }
}
