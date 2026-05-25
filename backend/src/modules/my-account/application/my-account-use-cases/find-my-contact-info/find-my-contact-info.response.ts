import { AddressResponse } from './address.response';

export class FindMyContactInfoResponse {
  public constructor(
    public readonly phoneNumber: string,
    public readonly addresses: AddressResponse[],
  ) {}
}
