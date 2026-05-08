import { AggregateRoot } from '../../../../shared/domain/aggregate-root';
import { PublisherIdEmptyException } from './exceptions/publisher-id-empty.exception';
import { PublisherNameEmptyException } from './exceptions/publisher-name.empty.exception';

export class Publisher extends AggregateRoot {
  private constructor(
    private readonly id: string,
    private name: string,
  ) {
    super();
  }

  public static create(id: string, name: string): Publisher {
    if (!id) {
      throw new PublisherIdEmptyException();
    }

    if (!name) {
      throw new PublisherNameEmptyException();
    }

    return new Publisher(id, name);
  }

  public static fromPersistent(id: string, name: string): Publisher {
    return new Publisher(id, name);
  }

  public rename(name: string): { oldName: string; newName: string } {
    const oldName = this.name;

    if (name && oldName !== name) {
      this.name = name;
    }

    return { oldName, newName: this.name };
  }

  public getId(): string {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }
}
