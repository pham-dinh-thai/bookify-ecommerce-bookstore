import { Gender } from '../../../../../shared/domain/enums/gender.enum';
import { AddressReadModel } from '../entities/read-models/address.read-model';

export class CustomerDetailReadModel {
  public constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly email: string,
    public readonly gender: Gender,
    public readonly phoneNumber: string,
    public readonly addresses: AddressReadModel[],
    public readonly isActive: boolean,
  ) {}
}
