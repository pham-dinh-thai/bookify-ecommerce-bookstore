import { AggregateRoot } from '../../../../shared/domain/aggregate-root';
import { FileNameEmptyException } from './exceptions/file-name-empty.exception';
import { CreateFileProps } from './types';
import { FileMimeType } from './value-objects/file-mime-type';
import { FileSize } from './value-objects/file-size';

/**
 * File aggregate — represents a file to be uploaded to storage.
 *
 * Responsibilities:
 * - Validate filename, MIME type, and file size via value objects
 * - Serve as the domain boundary that all upload input must pass through
 *
 * Note: This aggregate is transient — it is not persisted to a database.
 */
export class File extends AggregateRoot {
  private constructor(
    private filename: string,
    private mimetype: FileMimeType,
    private size: FileSize,
  ) {
    super();
  }

  public static create(props: CreateFileProps): File {
    if (!props.filename) {
      throw new FileNameEmptyException();
    }

    return new File(
      props.filename,
      FileMimeType.create(props.mimetype),
      FileSize.create(props.size),
    );
  }

  public getFilename(): string {
    return this.filename;
  }

  public getMimeType(): string {
    return this.mimetype.getValue();
  }

  public getSize(): number {
    return this.size.getValue();
  }
}
