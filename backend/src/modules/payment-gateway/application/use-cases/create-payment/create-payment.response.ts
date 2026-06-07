export class CreatePaymentResponse {
  public constructor(
    public readonly transactionId: string,
    public readonly providerOrderId: string,
    public readonly payUrl: string,
  ) {}
}
