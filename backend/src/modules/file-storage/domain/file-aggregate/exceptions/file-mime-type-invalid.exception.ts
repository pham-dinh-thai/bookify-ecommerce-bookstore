import { BadRequestDomainException } from '../../../../../shared/domain/exception/domain.exception';

export class FileMimeTypeInvalidException extends BadRequestDomainException {
  public constructor(allowedMimeTypes: string[]) {
    super(
      `File MIME type is invalid. Allowed MIME types: ${allowedMimeTypes.join(
        ', ',
      )}`,
      'FILE_MIME_TYPE_INVALID',
    );
  }
}
