export class AuditLogReadModel {
  public constructor(
    public readonly id: string,
    public readonly action: string,
    public readonly performedBy: string,
    public readonly metadata: any,
    public readonly createdAt: Date,
  ) {}
}
