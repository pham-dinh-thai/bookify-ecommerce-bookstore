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
import { IRenamePublisherRequest } from './rename-publisher.request';

@Injectable()
export class RenamePublisherUseCase {
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

  public async execute(
    id: string,
    request: IRenamePublisherRequest,
    performedBy: string,
  ): Promise<void> {
    const publisher = await this.publishersCommandRepository.findOne(id);

    if (publisher.getName() === request.name) {
      return;
    }

    const { oldName, newName } = publisher.rename(request.name);

    await this.unitOfWork.execute(async () => {
      await this.publishersCommandRepository.save(publisher);

      await this.auditLogCommandRepository.write(
        'RENAME_PUBLISHER',
        performedBy,
        'publisher-management',
        'publishers',
        {
          publisherId: publisher.getId(),
          publisherOldName: oldName,
          publisherNewName: newName,
        },
      );
    });

    await this.cacheRepository.delByPattern('publishers:*');
  }
}
