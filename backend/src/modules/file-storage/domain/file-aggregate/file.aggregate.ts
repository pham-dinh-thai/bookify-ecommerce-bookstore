import { AggregateRoot } from '../../../../shared/domain/aggregate-root';
import { CreateFileProps } from './types';
import { FileMimeType } from './value-objects/file-mime-type';
import { FileSize } from './value-objects/file-size';

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
      throw new Error('File name cannot be empty');
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
