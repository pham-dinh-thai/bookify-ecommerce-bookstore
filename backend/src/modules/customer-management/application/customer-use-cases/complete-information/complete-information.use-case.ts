import { Inject, Injectable } from '@nestjs/common';
import { ICompleteInformationRequest } from './complete-information.request';
import { Customer } from '../../../domain/customer-aggregate/customer.aggregate';
import {
  type IUuidGenerator,
  UUID_GENERATOR,
} from '../../../../../shared/uuid/domain/uuid-generator.interface';
import {
  type IUnitOfWork,
  UNIT_OF_WORK,
} from '../../../../../shared/unit-of-work/application/unit-of-work';
import {
  CUSTOMERS_COMMAND_REPOSITORY,
  type ICustomersCommandRepository,
} from '../../../domain/customer-aggregate/repositories/customers-command.repository.interface';
import {
  ADDRESSES_COMMAND_REPOSITORY,
  type IAddressesCommandRepository,
} from '../../../domain/customer-aggregate/entities/repositories/addresses-command.repository.interface';
import {
  AUDIT_LOG_COMMAND_REPOSITORY,
  type IAuditLogCommandRepository,
} from '../../../../audit-log/domain/audit-log-aggregate/repositories/audit-log-command.repository.interface';
import {
  CUSTOMER_MODULE_USERS_COMMAND_REPOSITORY,
  type IUsersCommandRepository,
} from '../../../domain/customer-aggregate/repositories/users-command.repository.interface';
import {
  type IPhoneNumberExistsChecker,
  PHONE_NUMBER_EXISTS_CHECKER,
} from '../../../domain/customer-aggregate/services/phone-number-exists-checker.service';
import { PhoneNumberAlreadyBeenUseException } from '../../../domain/customer-aggregate/exceptions/phone-number-already-been-use.exception';
import { JWt_SERVICE } from '../../../../../shared/jwt/domain/jwt.service';
import { SharedJwtService } from '../../../../../shared/jwt/infrastructure/shared-jwt.service';

@Injectable()
export class CompleteInformationUseCase {
  public constructor(
    @Inject(CUSTOMERS_COMMAND_REPOSITORY)
    private readonly commandRepository: ICustomersCommandRepository,

    @Inject(UUID_GENERATOR)
    private readonly uuid: IUuidGenerator,

    @Inject(UNIT_OF_WORK)
    private readonly unitOfWork: IUnitOfWork,

    @Inject(ADDRESSES_COMMAND_REPOSITORY)
    private readonly addressCommandRepository: IAddressesCommandRepository,

    @Inject(AUDIT_LOG_COMMAND_REPOSITORY)
    private readonly auditLogCommandRepository: IAuditLogCommandRepository,

    @Inject(CUSTOMER_MODULE_USERS_COMMAND_REPOSITORY)
    private readonly usersCommandRepository: IUsersCommandRepository,

    @Inject(PHONE_NUMBER_EXISTS_CHECKER)
    private readonly phoneNumberExistsChecker: IPhoneNumberExistsChecker,

    @Inject(JWt_SERVICE)
    private readonly jwtService: SharedJwtService,
  ) {}

  public async execute(
    token: string,
    request: ICompleteInformationRequest,
  ): Promise<void> {
    const payload = this.jwtService.verify(
      token,
      process.env.TEMP_TOKEN_SECRET!,
    );

    const userId = payload.userId as string;

    const isPhoneExists = await this.phoneNumberExistsChecker.exists(
      request.phoneNumber,
    );

    if (isPhoneExists) {
      throw new PhoneNumberAlreadyBeenUseException();
    }

    const id = this.uuid.generate();
    const customer = Customer.create(
      id,
      userId,
      request.gender,
      request.phoneNumber,
    );

    const addressId = this.uuid.generate();
    const address = customer.addAddress({
      id: addressId,
      isDefault: true,
      ...request.address,
    });

    await this.unitOfWork.execute(async () => {
      await this.commandRepository.save(customer);

      await this.usersCommandRepository.updateGender(
        customer.getUserId(),
        customer.getGender(),
      );

      await this.addressCommandRepository.save(customer.getId(), address);

      await this.auditLogCommandRepository.write(
        'COMPLETE_CUSTOMER_INFORMATION',
        customer.getUserId(),
        'customer-management',
        'customers',
        {
          customerId: customer.getId(),
          phoneNumber: request.phoneNumber,
          address: {
            addressId: address.getId(),
            provinceCode: request.address.provinceCode,
            provinceName: request.address.provinceName,
            wardCode: request.address.wardCode,
            wardName: request.address.wardName,
            street: request.address.street,
          },
        },
      );
    });
  }
}
