export class TopLanguageReadModel {
  public constructor(
    public readonly languageId: string,
    public readonly languageName: string,
    public readonly unitsSold: number,
    public readonly revenue: number,
  ) {}
}
