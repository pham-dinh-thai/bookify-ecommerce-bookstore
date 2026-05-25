import { AddressResponse } from './address.response';

export class FindMyContactInfoResponse {
  public constructor(
    public readonly phoneNumber: string | null,
    public readonly addresses: AddressResponse[],
  ) {}
}
