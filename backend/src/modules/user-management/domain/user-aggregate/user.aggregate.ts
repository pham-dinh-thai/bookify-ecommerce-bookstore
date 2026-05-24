import { Email } from '../../../../shared/domain/value-objects/email/email.value-object';
import { Password } from '../../../../shared/domain/value-objects/password/password.value-object';
import { Gender } from '../../../../shared/domain/enums/gender.enum';
import { GenderEmptyException } from './exceptions/gender-empty.exception';
import { GenderInvalidOptionException } from './exceptions/gender-invalid-option.exception';
import { PasswordNotMatchingException } from './exceptions/password-not-matching.exception';
import { PasswordVerifyFailed } from './exceptions/password-verify-failed.exception';
import { UserId } from './value-objects/user-id.value-object';
import { Name } from './value-objects/name.value-object';
import {
  CreateUserProps,
  FromPersistentUserProps,
  UpdateUserProps,
} from './types';

export class User {
  private constructor(
    private readonly id: UserId,
    private firstName: Name,
    private lastName: Name,
    private email: Email,
    private gender: Gender,
    private password: Password,
    private isActive: boolean = true,
    private roleId: string = 'staff', // When admin create an account, the default is staff; when customer register an account, it will be user
  ) {}

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

  public update(props: UpdateUserProps): void {
    if (!props.gender) {
      throw new GenderEmptyException();
    }

    const isIncludesInGender = Object.values(Gender).includes(props.gender);
    if (!isIncludesInGender) {
      throw new GenderInvalidOptionException(props.gender);
    }

    this.firstName = Name.create(props.firstName);
    this.lastName = Name.create(props.lastName);
    this.email = Email.create(props.email);
    this.gender = props.gender;
    this.roleId = props.roleId;
  }

  public deactivate(): void {
    this.isActive = false;
  }

  public activate(): void {
    this.isActive = true;
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
