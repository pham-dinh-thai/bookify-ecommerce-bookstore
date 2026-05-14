import { FileMimeTypeEmptyException } from '../exceptions/file-mime-type-empty.exception';
import { FileMimeTypeInvalidException } from '../exceptions/file-mime-type-invalid.exception';

export class FileMimeType {
  private static readonly allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'application/pdf',
    'text/plain',
  ];

  private constructor(public readonly value: string) {}

  public static create(value: string): FileMimeType {
    if (!value) {
      throw new FileMimeTypeEmptyException();
    }

    if (typeof value !== 'string') {
      throw new FileMimeTypeInvalidException(FileMimeType.allowedMimeTypes);
    }

    if (!FileMimeType.allowedMimeTypes.includes(value)) {
      throw new FileMimeTypeInvalidException(FileMimeType.allowedMimeTypes);
    }

    return new FileMimeType(value);
  }

  public getValue(): string {
    return this.value;
  }
}
