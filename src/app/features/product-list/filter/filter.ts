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
  CategoryAttributeOptions,
  CheckboxConfig,
  FilterConfigItem,
  FiltersConfig,
} from '../../../core/models/filter.model';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import {
  BASE_CATEGORY_CONFIG,
  BASE_IN_STOCK_CONFIG,
  BASE_RATING_CONFIG,
  CATEGORY_LABELS,
  RATING_LABELS,
} from '../../../core/constants/filters.constants';

interface FormValue {
  category: string;
  inStock: boolean;
  rating: number | null;
  attributes: Record<string, unknown>;
}

@Component({
  selector: 'app-filter',
  imports: [FormsModule, ReactiveFormsModule, MatButton, NxsCheckboxForm, MatProgressSpinner],
  templateUrl: './filter.html',
  styleUrl: './filter.scss',
})
export class FilterPanelComponent implements OnInit {
  private fb = inject(FormBuilder);
  private filtersStore = inject(FiltersStore);
  private productStore = inject(ProductStore);
  private filtersService = inject(FiltersService);
  private destroyRef = inject(DestroyRef);

  public hasActiveFilters = this.filtersStore.hasActiveFilters;
  public activeFiltersCount = this.filtersStore.activeFiltersCount;
  public filteredCount = this.productStore.filteredProductsCount;
  public totalCount = this.productStore.productsCount;
  public loading = true;
  public selectedCategory = 'all';
  public categoryConfig: CheckboxConfig = { ...BASE_CATEGORY_CONFIG };
  public inStockConfig: CheckboxConfig = { ...BASE_IN_STOCK_CONFIG };
  public ratingConfig: CheckboxConfig = { ...BASE_RATING_CONFIG };

  private filtersConfig: FiltersConfig = { common: [], categorySpecific: {} };
  private attributeOptions: Record<string, CategoryAttributeOptions> = {};

  dynamicFilters: (FilterConfigItem & { options: (string | number | boolean)[] })[] = [];
  dynamicFilterConfigs: CheckboxConfig[] = [];

  form: FormGroup = this.fb.group({
    category: ['all'],
    price: this.fb.group({
      min: [null as number | null],
      max: [null as number | null],
    }),
    inStock: [false],
    rating: [null as number | null],
    attributes: this.fb.group({}),
  });

  ngOnInit(): void {
    this.loadFiltersData();
  }

  private loadFiltersData(): void {
    this.filtersService
      .loadFiltersData()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ config, availableOptions }) => {
          this.filtersConfig = config;
          this.attributeOptions = availableOptions.attributeOptions;

          this.setupCategoryConfig(availableOptions.categories);
          this.setupRatingConfig(config);
          this.setupFormListeners();

          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading filters:', error);
          this.loading = false;
        },
      });
  }

  private setupCategoryConfig(categories: string[]): void {
    this.categoryConfig = {
      ...BASE_CATEGORY_CONFIG,
      options: [
        { value: 'all', label: 'Всі товари' },
        ...categories.map((cat) => ({
          value: cat,
          label: CATEGORY_LABELS[cat] || cat,
        })),
      ],
    };
  }

  private setupRatingConfig(config: FiltersConfig): void {
    const ratingFilter = config.common.find((f) => f.key === 'rating');
    const ratings = ratingFilter?.options || [5, 4, 3, 2, 1];

    this.ratingConfig = {
      ...BASE_RATING_CONFIG,
      label: ratingFilter?.label || 'Рейтинг',
      options: ratings.map((rating) => ({
        value: rating,
        label: RATING_LABELS[rating as number] || `${rating} зірок`,
      })),
    };
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
      .subscribe((value) => {
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

    const categoryConfig = this.filtersConfig.categorySpecific[category] || [];
    const options = this.attributeOptions[category] || {};

    categoryConfig.forEach((filter) => {
      const filterOptions = this.getFilterOptions(filter, options);

      if (filterOptions.length === 0 && filter.type !== 'toggle') return;

      this.dynamicFilters.push({ ...filter, options: filterOptions });

      this.dynamicFilterConfigs.push({
        label: filter.label,
        type: filter.type as 'checkbox' | 'radio' | 'boolean',
        options: filterOptions.map((opt) => ({
          value: opt,
          label: String(opt),
        })),
      });

      if (filter.type === 'checkbox') {
        const checkboxArray = this.fb.array(filterOptions.map(() => this.fb.control(false)));
        attributesGroup.addControl(filter.key, checkboxArray);
      } else if (filter.type === 'toggle') {
        attributesGroup.addControl(filter.key, this.fb.control(false));
      } else if (filter.type === 'radio') {
        attributesGroup.addControl(filter.key, this.fb.control(null));
      }
    });
  }

  private getFilterOptions(
    filter: FilterConfigItem,
    categoryOptions: CategoryAttributeOptions,
  ): (string | number | boolean)[] {
    const productOptions = categoryOptions[filter.key];
    return productOptions && productOptions.length > 0 ? productOptions : filter.options || [];
  }

  private updateStoreCategory(category: string): void {
    this.filtersStore.setCategories(category === 'all' ? [] : [category]);
  }

  private updateStore(value: FormValue): void {
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
        this.filtersStore.setDynamicFilter(filter.key, controlValue as string | number | boolean);
      } else {
        this.filtersStore.removeDynamicFilter(filter.key);
      }
    });
  }

  getAttributeArray(key: string): FormArray<FormControl<boolean>> {
    const attributesGroup = this.form.get('attributes') as FormGroup;
    return attributesGroup.get(key) as FormArray<FormControl<boolean>>;
  }

  reset(): void {
    this.form.reset({
      category: 'all',
      inStock: false,
      rating: null,
      attributes: {},
    });

    this.selectedCategory = 'all';
    this.filtersStore.reset();
  }
}
