import { AddressReadModel } from '../entities/read-models/address.read-model';

export class CustomerReadModel {
  public constructor(
    public readonly id: string,
    public readonly phoneNumber: string | null,
    public readonly addresses: AddressReadModel[],
  ) {}
}
