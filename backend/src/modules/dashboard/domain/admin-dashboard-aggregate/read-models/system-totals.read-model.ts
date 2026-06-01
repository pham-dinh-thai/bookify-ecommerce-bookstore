export class SystemTotalsReadModel {
  public constructor(
    public readonly totalStaff: number,
    public readonly totalCustomers: number,
    public readonly totalGenres: number,
    public readonly totalPublishers: number,
    public readonly totalAuthors: number,
    public readonly totalLanguages: number,
    public readonly totalBooks: number,
    public readonly totalAuditLogs: number,
  ) {}
}
