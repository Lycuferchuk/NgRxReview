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

interface FilterFormValue {
  category: string;
  inStock: boolean;
  rating: number | null;
  attributes: Record<string, unknown>;
}

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
  public categoryConfig: FilterUIConfig = CATEGORY_CONFIG;
  public inStockConfig: FilterUIConfig = IN_STOCK_CONFIG;
  public ratingConfig: FilterUIConfig = RATING_CONFIG;
  public dynamicFilters: DynamicFilter[] = [];
  public dynamicFilterConfigs: FilterUIConfig[] = [];

  public form: FormGroup = this.fb.group({
    category: ['all'],
    inStock: [false],
    rating: [null as number | null],
    attributes: this.fb.group({}),
  });

  private filtersConfig: FiltersConfig = {
    common: [],
    categorySpecific: {} as Record<Category, FilterConfig[]>,
  };
  private attributeOptions: Record<Category, Record<string, FilterPrimitive[]>> = {} as Record<
    Category,
    Record<string, FilterPrimitive[]>
  >;

  constructor(
    private readonly fb: FormBuilder,
    private readonly filtersService: FiltersService,
  ) {}

  public ngOnInit(): void {
    this.loadFiltersData();
  }

  public getAttributeArray(key: string): FormArray<FormControl<boolean>> {
    const attributesGroup = this.form.get('attributes') as FormGroup;
    return attributesGroup.get(key) as FormArray<FormControl<boolean>>;
  }

  public reset(): void {
    this.form.reset({
      category: 'all',
      inStock: false,
      rating: null,
      attributes: {},
    });
    this.selectedCategory = 'all';
    this.dynamicFilters = [];
    this.dynamicFilterConfigs = [];
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
        error: (error) => {
          console.error('Error loading filters:', error);
          this.loading = false;
        },
      });
  }

  private setupFormListeners(): void {
    this.form
      .get('category')
      ?.valueChanges.pipe(distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe((category: string) => {
        this.selectedCategory = category;
        this.updateDynamicFilters(category);
        this.updateStoreCategory(category);
      });

    this.form.valueChanges
      .pipe(debounceTime(300), takeUntilDestroyed(this.destroyRef))
      .subscribe((value: FilterFormValue) => {
        this.updateStore(value);
      });
  }

  private updateDynamicFilters(category: string): void {
    const attributesGroup = this.form.get('attributes') as FormGroup;

    Object.keys(attributesGroup.controls).forEach((key) => {
      attributesGroup.removeControl(key);
    });

    this.filtersStore.resetDynamic();
    this.dynamicFilters = [];
    this.dynamicFilterConfigs = [];

    if (category === 'all') return;

    const categoryConfig = this.filtersConfig.categorySpecific[category as Category] || [];
    const options = this.attributeOptions[category as Category] || {};

    categoryConfig.forEach((filter) => {
      const filterOptions = this.getFilterOptions(filter, options);

      if (filterOptions.length === 0 && filter.type !== 'toggle') return;

      this.dynamicFilters.push({ ...filter, options: filterOptions });

      this.dynamicFilterConfigs.push({
        label: filter.label,
        type: filter.type === 'toggle' ? 'boolean' : (filter.type as 'checkbox' | 'radio'),
        options: filterOptions.map((opt) => ({
          value: opt,
          label: String(opt),
        })),
      });

      this.addFormControl(attributesGroup, filter, filterOptions);
    });
  }

  private addFormControl(group: FormGroup, filter: FilterConfig, options: FilterPrimitive[]): void {
    switch (filter.type) {
      case 'checkbox': {
        const checkboxArray = this.fb.array(options.map(() => this.fb.control(false)));
        group.addControl(filter.key, checkboxArray);
        break;
      }
      case 'toggle':
        group.addControl(filter.key, this.fb.control(false));
        break;
      case 'radio':
        group.addControl(filter.key, this.fb.control(null));
        break;
    }
  }

  private getFilterOptions(
    filter: FilterConfig,
    categoryOptions: Record<string, FilterPrimitive[]>,
  ): FilterPrimitive[] {
    const productOptions = categoryOptions[filter.key];
    return productOptions?.length > 0
      ? productOptions
      : (filter.options as FilterPrimitive[]) || [];
  }

  private updateStoreCategory(category: string): void {
    this.filtersStore.setCategories(category === 'all' ? [] : [category as Category]);
  }

  private updateStore(value: FilterFormValue): void {
    this.filtersStore.setInStock(value.inStock);
    this.filtersStore.setRating(value.rating);

    if (value.attributes) {
      this.updateDynamicStore(value.attributes);
    }
  }

  private updateDynamicStore(attributes: Record<string, unknown>): void {
    if (this.selectedCategory === 'all') return;

    this.dynamicFilters.forEach((filter) => {
      const controlValue = attributes[filter.key];
      const filterOptions = filter.options;

      if (filter.type === 'checkbox' && Array.isArray(controlValue)) {
        const selected = filterOptions.filter((_, i) => controlValue[i] === true);
        if (selected.length > 0) {
          this.filtersStore.setDynamicFilter(filter.key, selected);
        } else {
          this.filtersStore.removeDynamicFilter(filter.key);
        }
      } else if (filter.type === 'toggle' && typeof controlValue === 'boolean') {
        if (controlValue) {
          this.filtersStore.setDynamicFilter(filter.key, true);
        } else {
          this.filtersStore.removeDynamicFilter(filter.key);
        }
      } else if (filter.type === 'radio' && controlValue !== null) {
        this.filtersStore.setDynamicFilter(filter.key, controlValue as FilterPrimitive);
      } else {
        this.filtersStore.removeDynamicFilter(filter.key);
      }
    });
  }
}
