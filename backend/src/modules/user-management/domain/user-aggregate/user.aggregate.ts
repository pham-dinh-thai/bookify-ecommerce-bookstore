import { AggregateRoot } from '../../../../shared/domain/aggregate-root';
import { Email } from '../../../../shared/domain/value-objects/email/email.value-object';
import { Password } from '../../../../shared/domain/value-objects/password/password.value-object';
import { Gender } from '../../../../shared/domain/enums/gender.enum';
import { PasswordChanged } from './events/password-changed';
import { UserCreated } from './events/user-created.event';
import { UserDeactivated } from './events/user-deactivated.event';
import { FirstNameEmptyException } from './exceptions/first-name-empty.exception';
import { GenderEmptyException } from './exceptions/gender-empty.exception';
import { GenderInvalidOptionException } from './exceptions/gender-invalid-option.exception';
import { LastNameEmptyException } from './exceptions/last-name-empty.exception';
import { PasswordNotMatchingException } from './exceptions/password-not-matching.exception';
import { PasswordVerifyFailed } from './exceptions/password-verify-failed.exception';
import { UserIdEmptyException } from './exceptions/user-id-empty.exception';

export class User extends AggregateRoot {
  private constructor(
    private readonly id: string,
    private firstName: string,
    private lastName: string,
    private email: Email,
    private gender: Gender,
    private password: Password,
    private isActive: boolean = true,
    private roleId: string = 'staff', // When admin create an account, the default is staff; when customer register an account, it will be user
  ) {
    super();
  }

  public static async create(
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    gender: Gender,
    password: string,
    roleId: string,
  ): Promise<User> {
    if (!id) {
      throw new UserIdEmptyException();
    }

    if (!firstName) {
      throw new FirstNameEmptyException();
    }

    if (!lastName) {
      throw new LastNameEmptyException();
    }

    if (!gender) {
      throw new GenderEmptyException();
    }

    const isIncludesInGender = Object.values(Gender).includes(gender);
    if (!isIncludesInGender) {
      throw new GenderInvalidOptionException(gender);
    }

    const user = new User(
      id,
      firstName,
      lastName,
      Email.create(email),
      gender,
      await Password.create(password),
      true,
      roleId,
    );

    user.addDomainEvent(new UserCreated(id));

    return user;
  }

  public static fromPersistent(
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    gender: string,
    password: string,
    isActive: boolean,
    roleId: string,
  ): User {
    return new User(
      id,
      firstName,
      lastName,
      Email.create(email),
      gender as Gender,
      Password.fromHashed(password),
      isActive,
      roleId,
    );
  }

  public deactivate(): void {
    this.isActive = false;

    this.addDomainEvent(new UserDeactivated(this.id));
  }

  public async changePassword(
    oldPassword: string,
    newPassword: string,
    newPasswordConfirm: string,
  ): Promise<void> {
    const isVerify = await this.password.compare(oldPassword);
    if (!isVerify) {
      throw new PasswordVerifyFailed();
    }

    const password = await Password.create(newPassword);

    const isMatch = await password.compare(newPasswordConfirm);
    if (!isMatch) {
      throw new PasswordNotMatchingException();
    }

    this.password = password;

    this.addDomainEvent(new PasswordChanged(this.id));
  }

  public getIsActive(): boolean {
    return this.isActive;
  }

  public getPassword(): string {
    return this.password.getValue();
  }

  public getId(): string {
    return this.id;
  }

  public getEmail(): string {
    return this.email.getValue();
  }

  public getFirstName(): string {
    return this.firstName;
  }

  public getLastName(): string {
    return this.lastName;
  }

  public getGender(): Gender {
    return this.gender;
  }

  public getRoleId(): string {
    return this.roleId;
  }
}
