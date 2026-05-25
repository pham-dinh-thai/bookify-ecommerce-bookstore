import { Inject, Injectable } from '@nestjs/common';
import {
  CUSTOMERS_COMMAND_REPOSITORY,
  type ICustomersCommandRepository,
} from '../../../../customer-management/domain/customer-aggregate/repositories/customers-command.repository.interface';
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
import { IUpdatePhoneNumberRequest } from './update-phone-number.request';
import { Customer } from '../../../../customer-management/domain/customer-aggregate/customer.aggregate';
import {
  type IUuidGenerator,
  UUID_GENERATOR,
} from '../../../../../shared/modules/uuid/domain/uuid-generator.interface';

@Injectable()
export class UpdatePhoneNumberUseCase {
  public constructor(
    @Inject(CUSTOMERS_COMMAND_REPOSITORY)
    private readonly customersCommandRepository: ICustomersCommandRepository,

    @Inject(AUDIT_LOG_COMMAND_REPOSITORY)
    private readonly auditLogCommandRepository: IAuditLogCommandRepository,

    @Inject(CACHE_REPOSITORY)
    private readonly cacheRepository: ICacheRepository,

    @Inject(UNIT_OF_WORK)
    private readonly unitOfWork: IUnitOfWork,

    @Inject(UUID_GENERATOR)
    private readonly uuidGenerator: IUuidGenerator,
  ) {}

  public async execute(
    request: IUpdatePhoneNumberRequest,
    userId: string,
  ): Promise<void> {
    let customer: Customer | null =
      await this.customersCommandRepository.findByUserId(userId);

    await this.unitOfWork.execute(async () => {
      if (!customer) {
        customer = Customer.create({
          id: this.uuidGenerator.generate(),
          userId: userId,
          phoneNumber: request.phoneNumber,
        });

        await this.customersCommandRepository.insert(customer);
      } else {
        customer.updatePhoneNumber(request.phoneNumber);

        await this.customersCommandRepository.save(customer);
      }

      await this.auditLogCommandRepository.write(
        'UPDATE_PHONE_NUMBER',
        userId,
        'my-account',
        'customers',
        { userId },
      );
    });

    await this.cacheRepository.delByPattern('customers:*');
  }
}
