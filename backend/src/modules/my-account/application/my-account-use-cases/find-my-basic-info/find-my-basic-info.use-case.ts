import { Inject, Injectable } from '@nestjs/common';
import { UserNotFoundException } from '../../../../user-management/domain/user-aggregate/exceptions/user-not-found.exception';
import { FindMyBasicInfoResponse } from './find-my-basic-info.response';
import {
  type IUsersQueryRepository,
  USERS_QUERY_REPOSITORY,
} from '../../../../user-management/domain/user-aggregate/repositories/users-query.repository.interface';
import { UserReadModel } from '../../../../user-management/domain/user-aggregate/read-models/user.read-model';

@Injectable()
export class FindMyBasicInfoUseCase {
  public constructor(
    @Inject(USERS_QUERY_REPOSITORY)
    private readonly usersQueryRepository: IUsersQueryRepository,
  ) {}

  public async execute(userId: string): Promise<FindMyBasicInfoResponse> {
    const user: UserReadModel | null =
      await this.usersQueryRepository.findOne(userId);

    if (!user) {
      throw new UserNotFoundException();
    }

    return new FindMyBasicInfoResponse(
      user.firstName,
      user.lastName,
      user.gender,
      user.email,
    );
  }
}
