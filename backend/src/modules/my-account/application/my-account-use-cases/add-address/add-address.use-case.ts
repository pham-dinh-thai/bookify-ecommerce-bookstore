import { Inject, Injectable } from '@nestjs/common';
import { IAddAddressRequest } from './add-address.request';
import {
  CUSTOMERS_COMMAND_REPOSITORY,
  type ICustomersCommandRepository,
} from '../../../../customer-management/domain/customer-aggregate/repositories/customers-command.repository.interface';
import { Customer } from '../../../../customer-management/domain/customer-aggregate/customer.aggregate';
import { CustomerNotFoundException } from '../../../../customer-management/domain/customer-aggregate/exceptions/customer-not-found.exception';
import {
  type IUuidGenerator,
  UUID_GENERATOR,
} from '../../../../../shared/modules/uuid/domain/uuid-generator.interface';
import {
  AUDIT_LOG_COMMAND_REPOSITORY,
  type IAuditLogCommandRepository,
} from '../../../../audit-log/domain/audit-log-aggregate/repositories/audit-log-command.repository.interface';
import {
  type IUnitOfWork,
  UNIT_OF_WORK,
} from '../../../../../shared/modules/unit-of-work/application/unit-of-work';

@Injectable()
export class AddAddressUseCase {
  public constructor(
    @Inject(CUSTOMERS_COMMAND_REPOSITORY)
    private readonly customersCommandRepository: ICustomersCommandRepository,

    @Inject(AUDIT_LOG_COMMAND_REPOSITORY)
    private readonly auditLogCommandRepository: IAuditLogCommandRepository,

    @Inject(UNIT_OF_WORK)
    private readonly unitOfWork: IUnitOfWork,

    @Inject(UUID_GENERATOR)
    private readonly uuidGenerator: IUuidGenerator,
  ) {}

  public async execute(
    request: IAddAddressRequest,
    userId: string,
  ): Promise<void> {
    let customer: Customer | null =
      await this.customersCommandRepository.findByUserId(userId);

    await this.unitOfWork.execute(async () => {
      if (!customer) {
        customer = Customer.create({
          id: this.uuidGenerator.generate(),
          userId: userId,
        });

        await this.customersCommandRepository.insert(customer);
      }

      const addedAddress = customer.addAddress({
        id: this.uuidGenerator.generate(),
        street: request.street,
        provinceCode: request.provinceCode,
        provinceName: request.provinceName,
        wardCode: request.wardCode,
        wardName: request.wardName,
      });

      await this.customersCommandRepository.addAddress(
        customer.getId(),
        addedAddress,
      );

      await this.auditLogCommandRepository.write(
        'ADD_ADDRESS',
        userId,
        'my-account',
        'addresses',
        {
          userId: userId,
          customerId: customer.getId(),
          addedAddress,
        },
      );
    });
  }
}
