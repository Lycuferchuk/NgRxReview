export type FilterType =
  | 'checkbox'
  | 'radio'
  | 'range'
  | 'boolean'
  | 'select'
  | 'multi-select'
  | 'text';

export interface FilterOption {
  value: string | number;
  label: string;
  count?: number;
  disabled?: boolean;
}

export interface BaseFilter {
  key: string;
  type: FilterType;
  label: string;
  renderAs?: string;
  queryParam?: string | PriceRange;
  multiple?: boolean;
  showCounts?: boolean;
  ui?: Record<string, unknown>;
}

export interface PriceRange {
  min: number;
  max: number;
}

export interface CheckboxFilter extends BaseFilter {
  type: 'checkbox';
  options: FilterOption[];
}

export interface RadioFilter extends BaseFilter {
  type: 'radio';
  options: FilterOption[];
}

export interface SelectFilter extends BaseFilter {
  type: 'select' | 'multi-select';
  options: FilterOption[];
}

export interface RangeFilter extends BaseFilter {
  type: 'range';
  min: number;
  max: number;
  step?: number;
  unit?: string;
}

export interface TextFilter extends BaseFilter {
  type: 'text';
  placeholder?: string;
}

export interface BooleanFilter extends BaseFilter {
  type: 'boolean';
}

export type Filter =
  | CheckboxFilter
  | RadioFilter
  | SelectFilter
  | RangeFilter
  | TextFilter
  | BooleanFilter;

export interface CategoryFilters {
  label: string;
  filters: Filter[];
}

export interface FilterSchema {
  globalFilters: Filter[];
  categorySpecific: Record<string, CategoryFilters>;
  uiHints?: {
    showActiveChips?: boolean;
    clearAllButton?: boolean;
    mobileDrawer?: boolean;
    collapseLongOptionListsThreshold?: number;
  };
}
