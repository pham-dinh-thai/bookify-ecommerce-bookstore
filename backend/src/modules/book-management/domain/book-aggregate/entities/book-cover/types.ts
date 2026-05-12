export type BookCoverProps = {
  id: string;
  url: string;
  isPrimary: boolean;
  displayOrder: number;
};

export type CreateBookCoverProps = Omit<BookCoverProps, 'isPrimary'>;
