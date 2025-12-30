import { Injectable } from '@angular/core';
import { Observable, map, forkJoin } from 'rxjs';
import { DataService } from './data.service';
import {
  AvailableFilterOptions,
  CategoryAttributeOptions,
  FiltersConfig,
} from '../models/filter.model';
import { Product, ProductAttributeValue } from '../models/product.model';
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

  public getFiltersOptions(): Observable<FiltersConfig> {
    return this._dataService.getDataFromJson<FiltersConfig>(FILTERS_JSON_KEY);
  }

  public loadFiltersData(): Observable<FiltersData> {
    return forkJoin({
      config: this.getFiltersOptions(),
      products: this._productsService.getProductsList(),
    }).pipe(
      map(({ config, products }) => ({
        config,
        availableOptions: this.extractAvailableOptions(products),
      })),
    );
  }

  private extractAvailableOptions(products: Product[]): AvailableFilterOptions {
    const categories = [...new Set(products.map((p) => p.category))];
    const brands = [...new Set(products.map((p) => p.brand))].sort();
    const attributeOptions: Record<string, Record<string, Set<ProductAttributeValue>>> = {};

    products.forEach((product) => {
      if (!attributeOptions[product.category]) {
        attributeOptions[product.category] = {};
      }

      Object.entries(product.attributes).forEach(([key, value]) => {
        if (value === null || value === undefined) {
          return;
        }

        if (!attributeOptions[product.category][key]) {
          attributeOptions[product.category][key] = new Set<ProductAttributeValue>();
        }

        attributeOptions[product.category][key].add(value);
      });
    });

    const formattedAttributeOptions: Record<string, CategoryAttributeOptions> = {};

    Object.entries(attributeOptions).forEach(([category, attrs]) => {
      formattedAttributeOptions[category] = {};

      Object.entries(attrs).forEach(([key, valueSet]) => {
        const values = Array.from(valueSet).filter(
          (v): v is Exclude<ProductAttributeValue, undefined> => v !== undefined,
        );

        formattedAttributeOptions[category][key] = values.sort((a, b) => {
          if (typeof a === 'number' && typeof b === 'number') {
            return a - b;
          }
          if (typeof a === 'boolean' && typeof b === 'boolean') {
            return a === b ? 0 : a ? -1 : 1;
          }
          return String(a).localeCompare(String(b));
        });
      });
    });

    return {
      categories,
      brands,
      attributeOptions: formattedAttributeOptions,
    };
  }
}
