import { Inject, Injectable } from '@nestjs/common';
import { ICompleteInformationRequest } from './complete-information.request';
import { Customer } from '../../../domain/customer-aggregate/customer.aggregate';
import {
  type IUuidGenerator,
  UUID_GENERATOR,
} from '../../../../../shared/modules/uuid/domain/uuid-generator.interface';
import {
  type IUnitOfWork,
  UNIT_OF_WORK,
} from '../../../../../shared/modules/unit-of-work/application/unit-of-work';
import {
  CUSTOMERS_COMMAND_REPOSITORY,
  type ICustomersCommandRepository,
} from '../../../domain/customer-aggregate/repositories/customers-command.repository.interface';
import {
  AUDIT_LOG_COMMAND_REPOSITORY,
  type IAuditLogCommandRepository,
} from '../../../../audit-log/domain/audit-log-aggregate/repositories/audit-log-command.repository.interface';
import {
  type IPhoneNumberExistsChecker,
  PHONE_NUMBER_EXISTS_CHECKER,
} from '../../../domain/customer-aggregate/services/phone-number-exists-checker.service';
import { PhoneNumberAlreadyBeenUseException } from '../../../domain/customer-aggregate/exceptions/phone-number-already-been-use.exception';
import { JWt_SERVICE } from '../../../../../shared/modules/jwt/domain/jwt.service';
import { SharedJwtService } from '../../../../../shared/modules/jwt/infrastructure/shared-jwt.service';
import {
  CACHE_REPOSITORY,
  type ICacheRepository,
} from '../../../../../shared/modules/cache/domain/cache.repository.interface';
import {
  type IUsersCommandRepository,
  USERS_COMMAND_REPOSITORY,
} from '../../../../user-management/domain/user-aggregate/repositories/users-command.repository.interface';

@Injectable()
export class CompleteInformationUseCase {
  public constructor(
    @Inject(CUSTOMERS_COMMAND_REPOSITORY)
    private readonly customersCommandRepository: ICustomersCommandRepository,

    @Inject(USERS_COMMAND_REPOSITORY)
    private readonly usersCommandRepository: IUsersCommandRepository,

    @Inject(UUID_GENERATOR)
    private readonly uuidGenerator: IUuidGenerator,

    @Inject(UNIT_OF_WORK)
    private readonly unitOfWork: IUnitOfWork,

    @Inject(AUDIT_LOG_COMMAND_REPOSITORY)
    private readonly auditLogCommandRepository: IAuditLogCommandRepository,

    @Inject(PHONE_NUMBER_EXISTS_CHECKER)
    private readonly phoneNumberExistsChecker: IPhoneNumberExistsChecker,

    @Inject(JWt_SERVICE)
    private readonly jwtService: SharedJwtService,

    @Inject(CACHE_REPOSITORY)
    private readonly cache: ICacheRepository,
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

    const customer = Customer.create({
      id: this.uuidGenerator.generate(),
      userId: userId,
      gender: request.gender,
      phoneNumber: request.phoneNumber,
    });

    const addedAddress = customer.addAddress({
      id: this.uuidGenerator.generate(),
      street: request.address.street,
      provinceCode: request.address.provinceCode,
      provinceName: request.address.provinceName,
      wardCode: request.address.wardCode,
      wardName: request.address.wardName,
    });

    await this.unitOfWork.execute(async () => {
      await this.customersCommandRepository.insert(customer);

      await this.usersCommandRepository.updateGender(
        customer.getUserId(),
        customer.getGender(),
      );

      await this.customersCommandRepository.addAddress(
        customer.getId(),
        addedAddress,
      );

      await this.auditLogCommandRepository.write(
        'COMPLETE_CUSTOMER_INFORMATION',
        customer.getUserId(),
        'customer-management',
        'customers',
        {
          customerId: customer.getId(),
          phoneNumber: request.phoneNumber,
          address: {
            addressId: addedAddress.getId(),
            provinceCode: request.address.provinceCode,
            provinceName: request.address.provinceName,
            wardCode: request.address.wardCode,
            wardName: request.address.wardName,
            street: request.address.street,
          },
        },
      );
    });

    await this.cache.delByPattern('customers:*');
  }
}
