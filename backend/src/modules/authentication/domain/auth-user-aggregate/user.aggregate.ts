import { AggregateRoot } from '../../../../shared/domain/aggregate-root';
import { Email } from '../../../../shared/domain/value-objects/email/email.value-object';
import { Password } from '../../../../shared/domain/value-objects/password/password.value-object';
import { UserRegistered } from './events/user-registered.event';

export class AuthUser extends AggregateRoot {
  private constructor(
    private readonly id: string,
    private firstName: string,
    private lastName: string,
    private email: Email,
    private gender: 'other', // Customers can choose gender later
    private password: Password,
    private isActive: boolean = false, // When customer register an account, the account is inactive by default, and they need to verify
    private roleId: string = 'user', // When customer register an account, it will be user
  ) {
    super();
  }

  public static async create(
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    password: string,
  ): Promise<AuthUser> {
    const user = new AuthUser(
      id,
      firstName,
      lastName,
      Email.create(email),
      'other',
      await Password.create(password),
      false,
      'user',
    );

    user.addDomainEvent(new UserRegistered(id));

    return user;
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

  public getGender(): string {
    return this.gender;
  }

  public getRoleId(): string {
    return this.roleId;
  }
}
