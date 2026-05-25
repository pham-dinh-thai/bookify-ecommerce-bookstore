import { AddressReadModel } from '../entities/read-models/address.read-model';

export class CustomerReadModel {
  public constructor(
    public readonly id: string,
    public readonly phoneNumber: string,
    public readonly addresses: AddressReadModel[],
  ) {}
}
