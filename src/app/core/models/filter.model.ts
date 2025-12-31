import { Category } from './product.model';

export interface BasicFilters {
  searchQuery: string;
  category: Category | null;
  brands: string[];
  inStock: boolean;
  rating: number | null;
}

export type FilterPrimitive = string | number | boolean;

export type DynamicFilterValue = FilterPrimitive | FilterPrimitive[] | null;

export type DynamicFilters = Record<string, DynamicFilterValue>;

export type CheckboxValue = boolean[];
export type ToggleValue = boolean;
export type RadioValue = FilterPrimitive | null;
export type DynamicControlValue = CheckboxValue | ToggleValue | RadioValue;

export interface FiltersState {
  basic: BasicFilters;
  dynamic: DynamicFilters;
  loading: boolean;
}

export type FilterControlType = 'checkbox' | 'radio' | 'toggle';

export interface FilterConfig {
  key: string;
  label: string;
  type: FilterControlType;
  options?: FilterPrimitive[];
}

export interface FiltersConfig {
  common: FilterConfig[];
  categorySpecific: Record<Category, FilterConfig[]>;
}

export interface FilterOption {
  value: string | number | boolean | null;
  label: string;
  count?: number;
}

export interface FilterUIConfig {
  label: string;
  type: 'radio' | 'boolean' | 'checkbox';
  options?: FilterOption[];
}

export interface AvailableFilterOptions {
  categories: Category[];
  brands: string[];
  attributeOptions: Record<Category, Record<string, FilterPrimitive[]>>;
}
