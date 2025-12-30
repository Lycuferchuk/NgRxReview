import { Injectable } from '@angular/core';
import { Observable, map, forkJoin } from 'rxjs';
import { DataService } from './data.service';
import { AvailableFilterOptions, FilterPrimitive, FiltersConfig } from '../models/filter.model';
import { Category, Product } from '../models/product.model';
import { FILTERS_JSON_KEY } from '../constants/data-key.constants';
import { ProductService } from './product.service';

interface FiltersData {
  config: FiltersConfig;
  availableOptions: AvailableFilterOptions;
}

@Injectable({ providedIn: 'root' })
export class FiltersService {
  constructor(
    private readonly _dataService: DataService,
    private readonly _productsService: ProductService,
  ) {}

  public getFiltersConfig(): Observable<FiltersConfig> {
    return this._dataService.getDataFromJson<FiltersConfig>(FILTERS_JSON_KEY);
  }

  public loadFiltersData(): Observable<FiltersData> {
    return forkJoin({
      config: this.getFiltersConfig(),
      products: this._productsService.getProductsList(),
    }).pipe(
      map(({ config, products }) => ({
        config,
        availableOptions: this.extractAvailableOptions(products),
      })),
    );
  }

  private extractAvailableOptions(products: Product[]): AvailableFilterOptions {
    const categories = this.extractUniqueCategories(products);
    const brands = this.extractUniqueBrands(products);
    const attributeOptions = this.extractAttributeOptions(products);

    return { categories, brands, attributeOptions };
  }

  private extractUniqueCategories(products: Product[]): Category[] {
    return [...new Set(products.map((p) => p.category))];
  }

  private extractUniqueBrands(products: Product[]): string[] {
    return [...new Set(products.map((p) => p.brand))].sort();
  }

  private extractAttributeOptions(
    products: Product[],
  ): Record<Category, Record<string, FilterPrimitive[]>> {
    const result: Record<string, Record<string, Set<FilterPrimitive>>> = {};

    for (const product of products) {
      const { category, attributes } = product;

      if (!result[category]) {
        result[category] = {};
      }

      for (const [key, value] of Object.entries(attributes)) {
        if (value === null || value === undefined) continue;

        if (!result[category][key]) {
          result[category][key] = new Set();
        }

        result[category][key].add(value);
      }
    }

    const formatted: Record<Category, Record<string, FilterPrimitive[]>> = {} as any;

    for (const [category, attrs] of Object.entries(result)) {
      formatted[category as Category] = {};

      for (const [key, valueSet] of Object.entries(attrs)) {
        formatted[category as Category][key] = this.sortValues(Array.from(valueSet));
      }
    }

    return formatted;
  }

  private sortValues(values: FilterPrimitive[]): FilterPrimitive[] {
    return values.sort((a, b) => {
      if (typeof a === 'number' && typeof b === 'number') return a - b;
      if (typeof a === 'boolean' && typeof b === 'boolean') return a === b ? 0 : a ? -1 : 1;
      return String(a).localeCompare(String(b));
    });
  }
}
