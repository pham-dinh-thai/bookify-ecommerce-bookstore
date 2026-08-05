import { BookReadModel } from '../../domain/read-models/book.read-model';

export type RecommendationContext = {
  userId: string | undefined;
  page: number;
  limit: number;
};

export interface IRecommendationStrategy {
  recommend(context: RecommendationContext): Promise<BookReadModel[]>;
}
