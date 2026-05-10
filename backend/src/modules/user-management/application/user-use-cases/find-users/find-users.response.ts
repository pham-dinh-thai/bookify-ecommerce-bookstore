import { UserReadModel } from '../../../domain/user-aggregate/read-models/user.read-model';

export class FindUsersResponse {
  public constructor(
    public readonly users: UserReadModel[],
    public readonly total: number,
  ) {}
}
