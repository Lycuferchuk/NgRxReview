import { Product } from '../models/product.model';
import { BasicFilters, DynamicFilters, FilterPrimitive } from '../models/filter.model';

export function filterProducts(
  products: Product[],
  basic: BasicFilters,
  dynamic: DynamicFilters,
): Product[] {
  return products.filter((product) => {
    if (!matchesSearchQuery(product, basic.searchQuery)) return false;
    if (!matchesCategories(product, basic.categories)) return false;
    if (!matchesBrands(product, basic.brands)) return false;
    if (!matchesInStock(product, basic.inStock)) return false;
    if (!matchesRating(product, basic.rating)) return false;
    return matchesDynamicFilters(product, dynamic);
  });
}

function matchesSearchQuery(product: Product, query: string): boolean {
  if (!query.trim()) return true;
  return product.name.toLowerCase().includes(query.toLowerCase());
}

function matchesCategories(product: Product, categories: string[]): boolean {
  if (categories.length === 0) return true;
  return categories.includes(product.category);
}

function matchesBrands(product: Product, brands: string[]): boolean {
  if (brands.length === 0) return true;
  return brands.includes(product.brand);
}

function matchesInStock(product: Product, inStockOnly: boolean): boolean {
  if (!inStockOnly) return true;
  return product.inStock;
}

function matchesRating(product: Product, minRating: number | null): boolean {
  if (minRating === null) return true;
  return product.rating >= minRating;
}

function matchesDynamicFilters(product: Product, dynamic: DynamicFilters): boolean {
  for (const [key, filterValue] of Object.entries(dynamic)) {
    if (filterValue === null || filterValue === undefined) continue;

    const attrValue = product.attributes[key];
    if (attrValue === undefined) continue;

    if (!matchesAttributeValue(attrValue, filterValue)) {
      return false;
    }
  }
  return true;
}

function matchesAttributeValue(
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
