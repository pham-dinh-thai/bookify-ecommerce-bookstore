import { AggregateRoot } from '../../../../shared/domain/aggregate-root';
import { Gender } from '../../../../shared/domain/enums/gender.enum';
import { Email } from '../../../../shared/domain/value-objects/email/email.value-object';
import { Password } from '../../../../shared/domain/value-objects/password/password.value-object';
import { UserRegistered } from './events/user-registered.event';
import { PasswordMismatchException } from './exceptions/password-mismatch.exception';

export class AuthenticableUser extends AggregateRoot {
  private constructor(
    private readonly id: string,
    private firstName: string,
    private lastName: string,
    private email: Email,
    private gender: Gender = Gender.OTHER, // Customers can choose gender later
    private password: Password,
    private isActive: boolean = false,
    private roleId: string = 'user', // When customer register an account, it will be user
  ) {
    super();
  }

  public static async register(
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    passwordConfirmation: string,
  ): Promise<AuthenticableUser> {
    if (password !== passwordConfirmation) {
      throw new PasswordMismatchException();
    }

    const user = new AuthenticableUser(
      id,
      firstName,
      lastName,
      Email.create(email),
      Gender.OTHER,
      await Password.create(password),
      false,
      'user',
    );

    user.addDomainEvent(new UserRegistered(id, email, lastName));

    return user;
  }

  public static fromPersistent(
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    gender: Gender,
    password: string,
    isActive: boolean,
  ) {
    return new AuthenticableUser(
      id,
      firstName,
      lastName,
      Email.create(email),
      gender,
      Password.fromHashed(password),
      isActive,
      'user',
    );
  }

  public activate(): void {
    this.isActive = true;
  }

  public inactivate(): void {
    this.isActive = false;
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
