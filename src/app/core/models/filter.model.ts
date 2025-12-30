import { ProductAttributeValue } from './product.model';

export interface BasicFilters {
  searchQuery: string;
  categories: string[];
  brands: string[];
  inStock: boolean;
  rating: number | null;
}

export type AttributeValue = string | number | boolean;

export type DynamicFilterValue = AttributeValue[] | AttributeValue | null;

export type DynamicFilters = Record<string, DynamicFilterValue>;

export type FilterControlType = 'checkbox' | 'radio' | 'range' | 'toggle';

export interface FilterConfigItem {
  key: string;
  label: string;
  type: FilterControlType;
  options?: (string | number | boolean)[];
}

export interface FiltersConfig {
  common: FilterConfigItem[];
  categorySpecific: Record<string, FilterConfigItem[]>;
}

export interface AvailableFilterOptions {
  categories: string[];
  brands: string[];
  attributeOptions: Record<string, CategoryAttributeOptions>;
}

export type CategoryAttributeOptions = Record<string, Exclude<ProductAttributeValue, undefined>[]>;

export interface CheckboxConfig {
  label: string;
  type: 'radio' | 'boolean' | 'checkbox';
  options?: { value: string | number | boolean; label: string; count?: number }[];
}
