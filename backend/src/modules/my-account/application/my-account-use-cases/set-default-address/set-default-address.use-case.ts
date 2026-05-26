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
  type IUnitOfWork,
  UNIT_OF_WORK,
} from '../../../../../shared/modules/unit-of-work/application/unit-of-work';
import { Customer } from '../../../../customer-management/domain/customer-aggregate/customer.aggregate';
import { CustomerNotFoundException } from '../../../../customer-management/domain/customer-aggregate/exceptions/customer-not-found.exception';

@Injectable()
export class SetDefaultAddressUseCase {
  public constructor(
    @Inject(CUSTOMERS_COMMAND_REPOSITORY)
    private readonly customersCommandRepository: ICustomersCommandRepository,

    @Inject(AUDIT_LOG_COMMAND_REPOSITORY)
    private readonly auditLogCommandRepository: IAuditLogCommandRepository,

    @Inject(UNIT_OF_WORK)
    private readonly unitOfWork: IUnitOfWork,
  ) {}

  public async execute(userId: string, addressId: string): Promise<void> {
    const customer: Customer | null =
      await this.customersCommandRepository.findByUserId(userId);

    if (!customer) {
      throw new CustomerNotFoundException(userId);
    }

    await this.unitOfWork.execute(async () => {
      await this.customersCommandRepository.setDefaultAddress(
        customer.getId(),
        addressId,
      );

      await this.auditLogCommandRepository.write(
        'SET_DEFAULT_ADDRESS',
        userId,
        'my-account',
        'addresses',
        {
          userId,
          customerId: customer.getId(),
          addressId,
        },
      );
    });
  }
}
