export type CreateReviewProps = {
  id: string;
  bookId: string;
  userId: string;
  rating: number;
  comment?: string | null;
};

export type FromPersistentReviewProps = {
  id: string;
  bookId: string;
  userId: string;
  rating: number;
  comment: string | null;
  createdAt: Date;
  updatedAt: Date;
};
