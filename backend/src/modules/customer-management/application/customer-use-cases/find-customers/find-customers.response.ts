import { CustomerDetailReadModel } from '../../../domain/customer-aggregate/read-models/customer-detail.read-model';

export class FindCustomersResponse {
  public constructor(
    public readonly customers: CustomerDetailReadModel[],
    public readonly total: number,
  ) {}
}
