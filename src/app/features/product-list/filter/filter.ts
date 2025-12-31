import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { FiltersStore } from '../../../core/store/filters.store';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButton } from '@angular/material/button';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { NxsCheckboxForm } from '../../../shared/components/nxs-checkbox-form/nxs-checkbox-form';
import { ProductStore } from '../../../core/store/products.store';
import { FiltersService } from '../../../core/services/filter.service';
import {
  FilterConfig,
  FilterPrimitive,
  FiltersConfig,
  FilterUIConfig,
} from '../../../core/models/filter.model';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import {
  CATEGORY_CONFIG,
  IN_STOCK_CONFIG,
  RATING_CONFIG,
} from '../../../core/constants/filters.constants';
import { Category } from '../../../core/models/product.model';
import { FilterHelper } from '../../../core/helper/filter.helper';

interface DynamicFilter extends FilterConfig {
  options: FilterPrimitive[];
}

@Component({
  selector: 'app-filter',
  imports: [FormsModule, ReactiveFormsModule, MatButton, NxsCheckboxForm, MatProgressSpinner],
  templateUrl: './filter.html',
  styleUrl: './filter.scss',
})
export class FilterPanelComponent implements OnInit {
  private readonly filtersStore = inject(FiltersStore);
  private readonly productStore = inject(ProductStore);
  private readonly destroyRef = inject(DestroyRef);

  public readonly hasActiveFilters = this.filtersStore.hasActiveFilters;
  public readonly activeFiltersCount = this.filtersStore.activeFiltersCount;
  public readonly filteredCount = this.productStore.filteredProductsCount;
  public readonly totalCount = this.productStore.productsCount;

  public loading = true;
  public selectedCategory = 'all';
  public dynamicFilters: DynamicFilter[] = [];
  public dynamicFilterConfigs: FilterUIConfig[] = [];

  public readonly categoryConfig: FilterUIConfig = CATEGORY_CONFIG;
  public readonly inStockConfig: FilterUIConfig = IN_STOCK_CONFIG;
  public readonly ratingConfig: FilterUIConfig = RATING_CONFIG;

  public form: FormGroup = this.fb.group({
    category: ['all'],
    inStock: [false],
    rating: [null as number | null],
    attributes: this.fb.group({}),
  });

  private filtersConfig!: FiltersConfig;
  private attributeOptions!: Record<Category, Record<string, FilterPrimitive[]>>;

  private get attributesGroup(): FormGroup {
    return this.form.get('attributes') as FormGroup;
  }

  constructor(
    private readonly fb: FormBuilder,
    private readonly filtersService: FiltersService,
  ) {}

  public ngOnInit(): void {
    this.loadFiltersData();
  }

  public getAttributeArray(key: string): FormArray<FormControl<boolean>> {
    return this.attributesGroup.get(key) as FormArray<FormControl<boolean>>;
  }

  public reset(): void {
    this.form.reset({ category: 'all', inStock: false, rating: null });
    this.selectedCategory = 'all';
    this.clearDynamicFilters();
    this.filtersStore.reset();
  }

  private loadFiltersData(): void {
    this.filtersService
      .loadFiltersData()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ config, availableOptions }) => {
          this.filtersConfig = config;
          this.attributeOptions = availableOptions.attributeOptions;
          this.setupFormListeners();
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading filters:', err);
          this.loading = false;
        },
      });
  }

  private setupFormListeners(): void {
    this.listenCategoryChanges();
    this.listenFormChanges();
  }

  private listenCategoryChanges(): void {
    this.form
      .get('category')
      ?.valueChanges.pipe(distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe((category: string) => this.onCategoryChange(category));
  }

  private listenFormChanges(): void {
    this.form.valueChanges
      .pipe(debounceTime(300), takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => this.syncToStore(value));
  }

  private onCategoryChange(category: string): void {
    this.selectedCategory = category;
    this.clearDynamicFilters();
    this.buildDynamicFilters(category);
    this.filtersStore.setCategories(category === 'all' ? [] : [category as Category]);
  }

  private clearDynamicFilters(): void {
    this.clearAttributeControls();
    this.filtersStore.resetDynamic();
    this.dynamicFilters = [];
    this.dynamicFilterConfigs = [];
  }

  private clearAttributeControls(): void {
    Object.keys(this.attributesGroup.controls).forEach((key) => {
      this.attributesGroup.removeControl(key);
    });
  }

  private buildDynamicFilters(category: string): void {
    const { filters, configs } = FilterHelper.buildDynamicFilters(
      category,
      this.filtersConfig,
      this.attributeOptions,
    );

    this.dynamicFilters = filters;
    this.dynamicFilterConfigs = configs;
    this.addDynamicControls(filters);
  }

  private addDynamicControls(filters: DynamicFilter[]): void {
    filters.forEach((filter) => {
      const control = this.createControlForFilter(filter);
      this.attributesGroup.addControl(filter.key, control);
    });
  }

  private createControlForFilter(filter: DynamicFilter): FormControl | FormArray {
    switch (filter.type) {
      case 'checkbox':
        return this.fb.array(filter.options.map(() => this.fb.control(false)));
      case 'toggle':
        return this.fb.control(false);
      case 'radio':
        return this.fb.control(null);
      default:
        return this.fb.control(null);
    }
  }

  private syncToStore(value: {
    inStock: boolean;
    rating: number | null;
    attributes: Record<string, unknown>;
  }): void {
    this.filtersStore.setInStock(value.inStock);
    this.filtersStore.setRating(value.rating);

    if (this.selectedCategory !== 'all') {
      this.syncDynamicFilters(value.attributes);
    }
  }

  private syncDynamicFilters(attributes: Record<string, unknown>): void {
    this.dynamicFilters.forEach((filter) => {
      const value = attributes[filter.key];
      this.syncSingleFilter(filter, value);
    });
  }

  private syncSingleFilter(filter: DynamicFilter, value: unknown): void {
    switch (filter.type) {
      case 'checkbox':
        this.syncCheckboxFilter(filter.key, value as boolean[], filter.options);
        break;
      case 'toggle':
        this.syncToggleFilter(filter.key, value as boolean);
        break;
      case 'radio':
        this.syncRadioFilter(filter.key, value as FilterPrimitive | null);
        break;
    }
  }

  private syncCheckboxFilter(key: string, values: boolean[], options: FilterPrimitive[]): void {
    if (!Array.isArray(values)) return;

    const selected = FilterHelper.extractSelectedCheckboxValues(values, options);

    if (selected.length > 0) {
      this.filtersStore.setDynamicFilter(key, selected);
    } else {
      this.filtersStore.removeDynamicFilter(key);
    }
  }

  private syncToggleFilter(key: string, value: boolean): void {
    if (value) {
      this.filtersStore.setDynamicFilter(key, true);
    } else {
      this.filtersStore.removeDynamicFilter(key);
    }
  }

  private syncRadioFilter(key: string, value: FilterPrimitive | null): void {
    if (value !== null && value !== undefined) {
      this.filtersStore.setDynamicFilter(key, value);
    } else {
      this.filtersStore.removeDynamicFilter(key);
    }
  }
}
