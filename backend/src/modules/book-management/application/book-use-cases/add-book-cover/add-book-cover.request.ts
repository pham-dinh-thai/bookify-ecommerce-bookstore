export interface IAddBookCoverRequest {
  bookId: string;
  url: string;
  isPrimary: boolean;
  displayOrder: number;
}
