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

type AttributeSet = Record<string, Set<FilterPrimitive>>;
type CategoryAttributeSets = Record<string, AttributeSet>;
type CategoryAttributeArrays = Record<Category, Record<string, FilterPrimitive[]>>;

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

  private extractAttributeOptions(products: Product[]): CategoryAttributeArrays {
    const grouped = this.groupAttributesByCategory(products);
    return this.convertSetsToSortedArrays(grouped);
  }

  private groupAttributesByCategory(products: Product[]): CategoryAttributeSets {
    return products.reduce<CategoryAttributeSets>((acc, product) => {
      const categoryAttrs = acc[product.category] ?? {};

      Object.entries(product.attributes).forEach(([key, value]) => {
        if (value == null) return;

        const attrSet = categoryAttrs[key] ?? new Set();
        attrSet.add(value);
        categoryAttrs[key] = attrSet;
      });

      acc[product.category] = categoryAttrs;
      return acc;
    }, {});
  }

  private convertSetsToSortedArrays(grouped: CategoryAttributeSets): CategoryAttributeArrays {
    return Object.entries(grouped).reduce<CategoryAttributeArrays>((acc, [category, attrs]) => {
      acc[category as Category] = Object.entries(attrs).reduce<Record<string, FilterPrimitive[]>>(
        (attrAcc, [key, valueSet]) => {
          attrAcc[key] = this.sortByType([...valueSet]);
          return attrAcc;
        },
        {},
      );
      return acc;
    }, {} as CategoryAttributeArrays);
  }

  private sortByType(values: FilterPrimitive[]): FilterPrimitive[] {
    return values.sort((a, b) => {
      if (typeof a === 'number' && typeof b === 'number') {
        return a - b;
      }

      if (typeof a === 'boolean' && typeof b === 'boolean') {
        return a === b ? 0 : a ? -1 : 1;
      }

      return String(a).localeCompare(String(b));
    });
  }
}
