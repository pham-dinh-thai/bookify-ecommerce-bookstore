export interface ICreateBookRequest {
  isbn: string;
  title: string;
  authorIds: string[];
  publisherId: string;
  genreIds: string[];
  description: string;
  originalPrice: number;
  quantity: number;
  languageId: string;
  pageCount: number;
}
