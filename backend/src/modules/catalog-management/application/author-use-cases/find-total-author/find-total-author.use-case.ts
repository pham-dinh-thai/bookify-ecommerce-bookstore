import { Inject, Injectable } from '@nestjs/common';
import {
  AUTHORS_QUERY_REPOSITORY,
  type IAuthorsQueryRepository,
} from '../../../domain/author-aggregate/repositories/authors-query.repository.interface';

@Injectable()
export class FindTotalAuthorUseCase {
  public constructor(
    @Inject(AUTHORS_QUERY_REPOSITORY)
    private readonly authorsQueryRepository: IAuthorsQueryRepository,
  ) {}

  public async execute(): Promise<number> {
    const total = await this.authorsQueryRepository.count();

    return total;
  }
}
