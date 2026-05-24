import { AggregateRoot } from '../../../../shared/domain/aggregate-root';
import { Email } from '../../../../shared/domain/value-objects/email/email.value-object';
import { Password } from '../../../../shared/domain/value-objects/password/password.value-object';
import { Gender } from '../../../../shared/domain/enums/gender.enum';
import { PasswordChanged } from './events/password-changed';
import { UserCreated } from './events/user-created.event';
import { UserDeactivated } from './events/user-deactivated.event';
import { GenderEmptyException } from './exceptions/gender-empty.exception';
import { GenderInvalidOptionException } from './exceptions/gender-invalid-option.exception';
import { PasswordNotMatchingException } from './exceptions/password-not-matching.exception';
import { PasswordVerifyFailed } from './exceptions/password-verify-failed.exception';
import { UserId } from './value-objects/user-id.value-object';
import { Name } from './value-objects/name.value-object';
import { UserUpdated } from './events/user-updated.event';
import { UserActivated } from './events/user-activated.event';
import { CreateUserProps, FromPersistentUserProps } from './types';

export class User extends AggregateRoot {
  private constructor(
    private readonly id: UserId,
    private firstName: Name,
    private lastName: Name,
    private email: Email,
    private gender: Gender,
    private password: Password,
    private isActive: boolean = true,
    private roleId: string = 'staff', // When admin create an account, the default is staff; when customer register an account, it will be user
  ) {
    super();
  }

  public static async create(props: CreateUserProps): Promise<User> {
    if (!props.gender) {
      throw new GenderEmptyException();
    }

    const isIncludesInGender = Object.values(Gender).includes(props.gender);
    if (!isIncludesInGender) {
      throw new GenderInvalidOptionException(props.gender);
    }

    return new User(
      UserId.create(props.id),
      Name.create(props.firstName),
      Name.create(props.lastName),
      Email.create(props.email),
      props.gender,
      await Password.create(props.password),
      true,
      props.roleId,
    );
  }

  public static fromPersistent(props: FromPersistentUserProps): User {
    return new User(
      UserId.create(props.id),
      Name.create(props.firstName),
      Name.create(props.lastName),
      Email.create(props.email),
      props.gender as Gender,
      Password.fromHashed(props.password),
      props.isActive,
      props.roleId,
    );
  }

  public update(
    firstName: string,
    lastName: string,
    email: string,
    gender: Gender,
    roleId: string,
  ): void {
    if (!gender) {
      throw new GenderEmptyException();
    }

    const isIncludesInGender = Object.values(Gender).includes(gender);
    if (!isIncludesInGender) {
      throw new GenderInvalidOptionException(gender);
    }

    let hasChanges = false;

    if (this.firstName.getValue() !== firstName) {
      this.firstName = Name.create(firstName);
      hasChanges = true;
    }

    if (this.lastName.getValue() !== lastName) {
      this.lastName = Name.create(lastName);
      hasChanges = true;
    }

    if (this.email.getValue() !== email) {
      this.email = Email.create(email);
      hasChanges = true;
    }

    if (this.gender !== gender) {
      this.gender = gender;
      hasChanges = true;
    }

    if (this.roleId !== roleId) {
      this.roleId = roleId;
      hasChanges = true;
    }

    if (hasChanges) {
      this.addDomainEvent(new UserUpdated(this.id.getValue()));
    }
  }

  public deactivate(): void {
    this.isActive = false;

    this.addDomainEvent(new UserDeactivated(this.id.getValue()));
  }

  public activate(): void {
    this.isActive = true;

    this.addDomainEvent(new UserActivated(this.id.getValue()));
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

    this.addDomainEvent(new PasswordChanged(this.id.getValue()));
  }

  public getIsActive(): boolean {
    return this.isActive;
  }

  public getPassword(): string {
    return this.password.getValue();
  }

  public getId(): string {
    return this.id.getValue();
  }

  public getEmail(): string {
    return this.email.getValue();
  }

  public getFirstName(): string {
    return this.firstName.getValue();
  }

  public getLastName(): string {
    return this.lastName.getValue();
  }

  public getGender(): Gender {
    return this.gender;
  }

  public getRoleId(): string {
    return this.roleId;
  }
}
