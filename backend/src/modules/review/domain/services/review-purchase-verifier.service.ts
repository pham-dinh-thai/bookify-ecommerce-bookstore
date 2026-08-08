export interface IReviewPurchaseVerifier {
  hasPurchased(userId: string, bookId: string): Promise<boolean>;
}

export const REVIEW_PURCHASE_VERIFIER = 'IReviewPurchaseVerifier';
