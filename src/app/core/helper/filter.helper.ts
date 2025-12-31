import { Category, Product } from '../models/product.model';
import {
  BasicFilters,
  DynamicFilters,
  FilterConfig,
  FilterPrimitive,
  FiltersConfig,
  FilterUIConfig,
} from '../models/filter.model';

export interface DynamicFilter extends FilterConfig {
  options: FilterPrimitive[];
}

export interface DynamicFiltersResult {
  filters: DynamicFilter[];
  configs: FilterUIConfig[];
}

export class FilterHelper {
  public static filterProducts(
    products: Product[],
    basic: BasicFilters,
    dynamic: DynamicFilters,
  ): Product[] {
    return products.filter((product) => {
      if (!this.matchesSearchQuery(product, basic.searchQuery)) return false;
      if (!this.matchesCategories(product, basic.categories)) return false;
      if (!this.matchesBrands(product, basic.brands)) return false;
      if (!this.matchesInStock(product, basic.inStock)) return false;
      if (!this.matchesRating(product, basic.rating)) return false;
      return this.matchesDynamicFilters(product, dynamic);
    });
  }

  private static matchesSearchQuery(product: Product, query: string): boolean {
    if (!query.trim()) return true;
    return product.name.toLowerCase().includes(query.toLowerCase());
  }

  private static matchesCategories(product: Product, categories: string[]): boolean {
    if (categories.length === 0) return true;
    return categories.includes(product.category);
  }

  private static matchesBrands(product: Product, brands: string[]): boolean {
    if (brands.length === 0) return true;
    return brands.includes(product.brand);
  }

  private static matchesInStock(product: Product, inStockOnly: boolean): boolean {
    if (!inStockOnly) return true;
    return product.inStock;
  }

  private static matchesRating(product: Product, minRating: number | null): boolean {
    if (minRating === null) return true;
    return product.rating >= minRating;
  }

  private static matchesDynamicFilters(product: Product, dynamic: DynamicFilters): boolean {
    for (const [key, filterValue] of Object.entries(dynamic)) {
      if (filterValue === null || filterValue === undefined) continue;

      const attrValue = product.attributes[key];
      if (attrValue === undefined) continue;

      if (!this.matchesAttributeValue(attrValue, filterValue)) {
        return false;
      }
    }
    return true;
  }

  private static matchesAttributeValue(
    attrValue: FilterPrimitive,
    filterValue: FilterPrimitive | FilterPrimitive[] | null,
  ): boolean {
    if (filterValue === null) return true;

    if (typeof filterValue === 'boolean') {
      return attrValue === filterValue;
    }

    if (Array.isArray(filterValue)) {
      if (filterValue.length === 0) return true;
      return filterValue.some((v) => String(v) === String(attrValue));
    }

    return String(attrValue) === String(filterValue);
  }

  public static buildDynamicFilters(
    category: string,
    filtersConfig: FiltersConfig,
    attributeOptions: Record<Category, Record<string, FilterPrimitive[]>>,
  ): DynamicFiltersResult {
    if (category === 'all') {
      return { filters: [], configs: [] };
    }

    const categoryConfig = filtersConfig.categorySpecific[category as Category] || [];
    const options = attributeOptions[category as Category] || {};
    const filters: DynamicFilter[] = [];
    const configs: FilterUIConfig[] = [];

    for (const filter of categoryConfig) {
      const filterOptions = this.getFilterOptions(filter, options);

      if (filterOptions.length === 0 && filter.type !== 'toggle') continue;

      filters.push({ ...filter, options: filterOptions });
      configs.push(this.buildUIConfig(filter, filterOptions));
    }

    return { filters, configs };
  }

  private static getFilterOptions(
    filter: FilterConfig,
    categoryOptions: Record<string, FilterPrimitive[]>,
  ): FilterPrimitive[] {
    const productOptions = categoryOptions[filter.key];
    return productOptions?.length > 0
      ? productOptions
      : (filter.options as FilterPrimitive[]) || [];
  }

  static buildUIConfig(filter: FilterConfig, options: FilterPrimitive[]): FilterUIConfig {
    return {
      label: filter.label,
      type: filter.type === 'toggle' ? 'boolean' : (filter.type as 'checkbox' | 'radio'),
      options: options.map((opt) => ({
        value: opt,
        label: String(opt),
      })),
    };
  }

  public static extractSelectedCheckboxValues(
    controlValue: boolean[],
    options: FilterPrimitive[],
  ): FilterPrimitive[] {
    return options.filter((_, i) => controlValue[i]);
  }
}
