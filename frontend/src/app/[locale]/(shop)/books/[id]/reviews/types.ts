export type Review = {
  id: string;
  bookId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
};

export type BookReviews = {
  reviews: Review[];
  averageRating: number | null;
  reviewCount: number;
};

export type MyReview = {
  hasPurchased: boolean;
  review: Review | null;
};
