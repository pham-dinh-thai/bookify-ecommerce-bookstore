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
    private gender: Gender = Gender.OTHER,
    private password: Password | null,
    private isActive: boolean = false,
    private roleId: string = 'user',
    private readonly provider: string | null = null,
    private readonly providerId: string | null = null,
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

  public static registerWithOAuth(
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    provider: string,
    providerId: string,
  ): AuthenticableUser {
    return new AuthenticableUser(
      id,
      firstName,
      lastName,
      Email.create(email),
      Gender.OTHER,
      null,
      true,
      'user',
      provider,
      providerId,
    );
  }

  public static fromPersistent(
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    gender: Gender,
    password: string | null,
    isActive: boolean,
    provider: string | null = null,
    providerId: string | null = null,
  ) {
    return new AuthenticableUser(
      id,
      firstName,
      lastName,
      Email.create(email),
      gender,
      password ? Password.fromHashed(password) : null,
      isActive,
      'user',
      provider,
      providerId,
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

  public getPassword(): string | null {
    return this.password?.getValue() ?? null;
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

  public getProvider(): string | null {
    return this.provider;
  }

  public getProviderId(): string | null {
    return this.providerId;
  }
}
