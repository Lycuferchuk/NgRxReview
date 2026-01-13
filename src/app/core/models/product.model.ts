import { BasicFilters, DynamicFilters } from './filter.model';

export type Category = 'phone' | 'laptop' | 'headphones' | 'tablet' | 'mouse';

export interface Product {
  id: string;
  name: string;
  category: Category;
  brand: string;
  price: number;
  rating: number;
  inStock: boolean;
  imageUrl: string;
  description?: string;
  attributes: ProductAttributes;
}

export interface ProductFilters {
  basic: BasicFilters;
  dynamic: DynamicFilters;
}

export type ProductAttributes = Record<string, string | number | boolean>;
