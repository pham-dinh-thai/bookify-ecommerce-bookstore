import { CustomerReadModel } from '../../../domain/customer-aggregate/read-models/customer.read-model';

export class FindCustomersResponse {
  public constructor(
    public readonly customers: CustomerReadModel[],
    public readonly total: number,
  ) {}
}
