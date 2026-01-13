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
      if (!this.matchesCategories(product, basic.category)) return false;
      if (!this.matchesBrands(product, basic.brands)) return false;
      if (!this.matchesInStock(product, basic.inStock)) return false;
      if (!this.matchesRating(product, basic.rating)) return false;
      if (!this.matchesPriceRange(product, basic.priceMin, basic.priceMax)) return false;
      return this.matchesDynamicFilters(product, dynamic);
    });
  }

  private static matchesPriceRange(
    product: Product,
    priceMin: number | null,
    priceMax: number | null,
  ): boolean {
    if (priceMin !== null && product.price < priceMin) return false;
    return !(priceMax !== null && product.price > priceMax);
  }

  private static matchesSearchQuery(product: Product, query: string): boolean {
    if (!query.trim()) return true;
    return product.name.toLowerCase().includes(query.toLowerCase());
  }

  private static matchesCategories(product: Product, categories: Category | null): boolean {
    if (!categories) return true;
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
    return Object.entries(dynamic).every(([key, filterValue]) => {
      if (filterValue == null) return true;

      const attrValue = product.attributes[key];
      if (attrValue == null) return true;

      return this.matchesAttributeValue(attrValue, filterValue);
    });
  }

  private static matchesAttributeValue(
    attrValue: FilterPrimitive,
    filterValue: FilterPrimitive | FilterPrimitive[],
  ): boolean {
    if (Array.isArray(filterValue)) {
      if (filterValue.length === 0) return true;
      return filterValue.some((v) => String(v) === String(attrValue));
    }
    return attrValue === filterValue;
  }

  static buildDynamicFilters(
    category: string,
    filtersConfig: FiltersConfig,
    attributeOptions: Record<Category, Record<string, FilterPrimitive[]>>,
  ): DynamicFiltersResult {
    if (category === 'all') {
      return { filters: [], configs: [] };
    }

    const cat = category as Category;
    const categoryConfig = filtersConfig.categorySpecific[cat] ?? [];
    const options = attributeOptions[cat] ?? {};

    return categoryConfig.reduce<DynamicFiltersResult>(
      (result, filter) => {
        const filterOptions = options[filter.key] ?? filter.options ?? [];

        if (filterOptions.length === 0 && filter.type !== 'toggle') {
          return result;
        }

        result.filters.push({ ...filter, options: filterOptions as FilterPrimitive[] });
        result.configs.push({
          label: filter.label,
          type: filter.type === 'toggle' ? 'boolean' : filter.type,
          options: filterOptions.map((opt) => ({ value: opt, label: String(opt) })),
        });

        return result;
      },
      { filters: [], configs: [] },
    );
  }

  public static extractSelectedCheckboxValues(
    controlValue: boolean[],
    options: FilterPrimitive[],
  ): FilterPrimitive[] {
    return options.filter((_, i) => controlValue[i]);
  }
}
