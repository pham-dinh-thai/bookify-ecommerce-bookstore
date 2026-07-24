export interface ProductSearchResult {
  id: string;
  title: string;
  description: string | null;
  originalPrice: number;
  discountPercentage: number;
}

export interface IToolService {
  searchProducts(query: string, limit?: number): Promise<ProductSearchResult[]>;
}

export const TOOL_SERVICE = 'IToolService';
