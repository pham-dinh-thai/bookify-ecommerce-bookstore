import { AggregateRoot } from '../../../../shared/domain/aggregate-root';
import { LanguageIdEmptyException } from './exceptions/language-id-empty.exception';
import { LanguageNameEmptyException } from './exceptions/language-name-empty.exception';

export class Language extends AggregateRoot {
  private constructor(
    private readonly id: string,
    private name: string,
  ) {
    super();
  }

  public static create(id: string, name: string): Language {
    if (!id) {
      throw new LanguageIdEmptyException();
    }

    if (!name) {
      throw new LanguageNameEmptyException();
    }

    return new Language(id, name);
  }

  public static fromPersistent(id: string, name: string): Language {
    return new Language(id, name);
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
