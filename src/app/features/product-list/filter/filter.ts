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
import { NxsCheckboxForm } from '../../../shared/components/nxs-checkbox-form/nxs-checkbox-form';
import { ProductStore } from '../../../core/store/products.store';
import { FiltersService } from '../../../core/services/filter.service';
import {
  CheckboxValue,
  DynamicControlValue,
  FilterConfig,
  FilterPrimitive,
  FiltersConfig,
  FilterUIConfig,
  PriceRange,
  RadioValue,
  ToggleValue,
} from '../../../core/models/filter.model';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import {
  CATEGORY_CONFIG,
  IN_STOCK_CONFIG,
  RATING_CONFIG,
} from '../../../core/constants/filters.constants';
import { Category } from '../../../core/models/product.model';
import { FilterHelper } from '../../../core/helper/filter.helper';
import { NxsPriceRange } from '../../../shared/components/nxs-price-range/nxs-price-range.component';
import { MatIcon } from '@angular/material/icon';

interface DynamicFilter extends FilterConfig {
  options: FilterPrimitive[];
}

interface FilterForm {
  category: string;
  inStock: boolean;
  rating: number | null;
  attributes: Record<string, DynamicControlValue>;
}

@Component({
  selector: 'nxs-filter',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatButton,
    NxsCheckboxForm,
    MatProgressSpinner,
    NxsPriceRange,
    MatIcon,
  ],
  templateUrl: './filter.html',
  styleUrl: './filter.scss',
})
export class FilterPanelComponent implements OnInit {
  public readonly filtersStore = inject(FiltersStore);
  private readonly productStore = inject(ProductStore);
  private readonly fb = inject(FormBuilder);
  private readonly filtersService = inject(FiltersService);
  private readonly destroyRef = inject(DestroyRef);

  public readonly hasActiveFilters = this.filtersStore.hasActiveFilters;
  public readonly activeFiltersCount = this.filtersStore.activeFiltersCount;
  public readonly filteredCount = this.productStore.productsCount;
  public readonly totalCount = this.productStore.productsCount;

  public readonly categoryConfig: FilterUIConfig = CATEGORY_CONFIG;
  public readonly inStockConfig: FilterUIConfig = IN_STOCK_CONFIG;
  public readonly ratingConfig: FilterUIConfig = RATING_CONFIG;
  public readonly isDirty = this.filtersStore.isDirty;
  public priceRange = { min: 0, max: 100000 };
  public loading = true;
  public selectedCategory = 'all';
  public dynamicFilters: DynamicFilter[] = [];
  public dynamicFilterConfigs: FilterUIConfig[] = [];

  public form = this.fb.group({
    category: this.fb.nonNullable.control('all'),
    inStock: this.fb.nonNullable.control(false),
    rating: this.fb.control<number | null>(null),
    attributes: this.fb.group({}),
  });

  private filtersConfig!: FiltersConfig;
  private attributeOptions!: Record<Category, Record<string, FilterPrimitive[]>>;

  private get attributesGroup(): FormGroup {
    return this.form.controls.attributes as FormGroup;
  }

  public ngOnInit(): void {
    this.loadFiltersData();
  }

  public getAttributeArray(key: string): FormArray<FormControl<boolean>> {
    return this.attributesGroup.get(key) as FormArray<FormControl<boolean>>;
  }

  public reset(): void {
    this.form.reset({
      category: 'all',
      inStock: false,
      rating: null,
    });
    this.selectedCategory = 'all';
    this.clearDynamicFilters();
    this.filtersStore.reset();
    this.productStore.loadProducts();
  }

  public onPriceRangeChange(range: PriceRange): void {
    this.filtersStore.setPriceRange(range.min, range.max);
  }

  public applyFilters(): void {
    const formValue = this.form.getRawValue();
    const categoryChanged = this.handleCategoryChange(formValue.category);

    this.applyBasicFilters(formValue);

    if (!categoryChanged) {
      this.applyDynamicFilters(formValue.attributes);
    }

    this.loadFilteredProducts();
  }

  private loadFiltersData(): void {
    this.filtersService
      .loadFiltersData()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ config, availableOptions }) => {
          this.filtersConfig = config;
          this.attributeOptions = availableOptions.attributeOptions;
          this.priceRange = availableOptions.priceRange;
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
    this.form.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.filtersStore.markAsDirty();
    });
  }

  private handleCategoryChange(newCategory: string): boolean {
    const categoryChanged = this.selectedCategory !== newCategory;

    if (!categoryChanged) {
      return false;
    }

    this.selectedCategory = newCategory;
    this.clearDynamicFilters();

    if (newCategory !== 'all') {
      this.buildDynamicFilters(newCategory);
    }
    return true;
  }

  private applyBasicFilters(formValue: FilterForm): void {
    this.filtersStore.setCategory(
      formValue.category === 'all' ? null : (formValue.category as Category),
    );
    this.filtersStore.setInStock(formValue.inStock);
    this.filtersStore.setRating(formValue.rating);
  }

  private applyDynamicFilters(attributes: Record<string, DynamicControlValue>): void {
    if (this.selectedCategory === 'all') {
      this.filtersStore.resetDynamic();
      return;
    }

    if (this.dynamicFilters.length === 0) {
      return;
    }

    this.syncDynamicFilters(attributes);
  }

  private loadFilteredProducts(): void {
    this.productStore.loadProducts();
    this.filtersStore.markAsApplied();
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
    const dynamicFilter = FilterHelper.buildDynamicFilters(
      category,
      this.filtersConfig,
      this.attributeOptions,
    );

    this.dynamicFilters = dynamicFilter.filters;
    this.dynamicFilterConfigs = dynamicFilter.configs;
    this.addDynamicControls(dynamicFilter.filters);
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

  private syncDynamicFilters(attributes: Record<string, DynamicControlValue>): void {
    this.dynamicFilters.forEach((filter) => {
      const value = attributes[filter.key];
      this.syncSingleFilter(filter, value);
    });
  }

  private syncSingleFilter(filter: DynamicFilter, value: DynamicControlValue): void {
    switch (filter.type) {
      case 'checkbox':
        this.syncCheckboxFilter(filter.key, value as CheckboxValue, filter.options);
        break;
      case 'toggle':
        this.syncToggleFilter(filter.key, value as ToggleValue);
        break;
      case 'radio':
        this.syncRadioFilter(filter.key, value as RadioValue);
        break;
    }
  }

  private syncCheckboxFilter(key: string, values: CheckboxValue, options: FilterPrimitive[]): void {
    const selected = FilterHelper.extractSelectedCheckboxValues(values, options);

    if (selected.length > 0) {
      this.filtersStore.setDynamicFilter(key, selected);
    } else {
      this.filtersStore.removeDynamicFilter(key);
    }
  }

  private syncToggleFilter(key: string, value: ToggleValue): void {
    if (value) {
      this.filtersStore.setDynamicFilter(key, true);
    } else {
      this.filtersStore.removeDynamicFilter(key);
    }
  }

  private syncRadioFilter(key: string, value: RadioValue): void {
    if (value != null) {
      this.filtersStore.setDynamicFilter(key, value);
    } else {
      this.filtersStore.removeDynamicFilter(key);
    }
  }
}
