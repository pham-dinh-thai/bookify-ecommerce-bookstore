import { Inject, Injectable } from '@nestjs/common';
import {
  type IPublishersCommandRepository,
  PUBLISHERS_COMMAND_REPOSITORY,
} from '../../../domain/publisher-aggregate/repositories/publishers-command.repository.inerface';
import {
  AUDIT_LOG_COMMAND_REPOSITORY,
  type IAuditLogCommandRepository,
} from '../../../../audit-log/domain/audit-log-aggregate/repositories/audit-log-command.repository.interface';
import {
  CACHE_REPOSITORY,
  type ICacheRepository,
} from '../../../../../shared/cache/domain/cache.repository.interface';
import {
  type IUnitOfWork,
  UNIT_OF_WORK,
} from '../../../../../shared/unit-of-work/application/unit-of-work';
import { PUBLISHER_CACHE_KEYS } from '../publisher-cache.constants';

@Injectable()
export class DeletePublisherUseCase {
  public constructor(
    @Inject(PUBLISHERS_COMMAND_REPOSITORY)
    private readonly publishersCommandRepository: IPublishersCommandRepository,

    @Inject(AUDIT_LOG_COMMAND_REPOSITORY)
    private readonly auditLogCommandRepository: IAuditLogCommandRepository,

    @Inject(CACHE_REPOSITORY)
    private readonly cacheRepository: ICacheRepository,

    @Inject(UNIT_OF_WORK)
    private readonly unitOfWork: IUnitOfWork,
  ) {}

  public async execute(id: string, performedBy: string): Promise<void> {
    const publisher = await this.publishersCommandRepository.findOne(id);

    await this.unitOfWork.execute(async () => {
      await this.publishersCommandRepository.delete(publisher);

      await this.auditLogCommandRepository.write(
        'DELETE_PUBLISHER',
        performedBy,
        'publisher-management',
        'publishers',
        {
          publisherId: publisher.getId(),
        },
      );
    });

    await this.cacheRepository.del(PUBLISHER_CACHE_KEYS.ALL);
  }
}
