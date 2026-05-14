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
} from '../../../../../shared/modules/cache/domain/cache.repository.interface';
import {
  type IUnitOfWork,
  UNIT_OF_WORK,
} from '../../../../../shared/modules/unit-of-work/application/unit-of-work';
import {
  type IUuidGenerator,
  UUID_GENERATOR,
} from '../../../../../shared/modules/uuid/domain/uuid-generator.interface';
import { ICreatePublisherRequest } from './create-publisher.request';
import { Publisher } from '../../../domain/publisher-aggregate/publisher.aggregate';

@Injectable()
export class CreatePublisherUseCase {
  public constructor(
    @Inject(PUBLISHERS_COMMAND_REPOSITORY)
    private readonly publishersCommandRepository: IPublishersCommandRepository,

    @Inject(AUDIT_LOG_COMMAND_REPOSITORY)
    private readonly auditLogCommandRepository: IAuditLogCommandRepository,

    @Inject(CACHE_REPOSITORY)
    private readonly cacheRepository: ICacheRepository,

    @Inject(UNIT_OF_WORK)
    private readonly unitOfWork: IUnitOfWork,

    @Inject(UUID_GENERATOR)
    private readonly uuid: IUuidGenerator,
  ) {}

  public async execute(
    request: ICreatePublisherRequest,
    performedBy: string,
  ): Promise<void> {
    const publisher = Publisher.create(this.uuid.generate(), request.name);

    await this.unitOfWork.execute(async () => {
      await this.publishersCommandRepository.save(publisher);

      await this.auditLogCommandRepository.write(
        'CREATE_PUBLISHER',
        performedBy,
        'publisher-management',
        'publishers',
        { publisherId: publisher.getId(), publisherName: publisher.getName() },
      );
    });

    await this.cacheRepository.delByPattern('publishers:*');
  }
}
