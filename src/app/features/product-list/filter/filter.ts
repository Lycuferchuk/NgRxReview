import { Component, DestroyRef, inject, afterNextRender } from '@angular/core';
import { MatCard } from '@angular/material/card';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FiltersStore } from '../../../core/store/filters.store';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButton } from '@angular/material/button';
import { debounceTime } from 'rxjs';
import { NxsFormRangeSlider } from '../../../shared/components/nxs-form-range-slider/nxs-form-range-slider.component';
import {
  CheckboxConfig,
  NxsCheckboxForm,
} from '../../../shared/components/nxs-checkbox-form/nxs-checkbox-form';
import { ProductStore } from '../../../core/store/products.store';

@Component({
  selector: 'app-filter',
  imports: [
    MatCard,
    FormsModule,
    ReactiveFormsModule,
    MatButton,
    NxsFormRangeSlider,
    NxsCheckboxForm,
  ],
  templateUrl: './filter.html',
  styleUrl: './filter.scss',
})
export class FilterPanelComponent {
  private fb = inject(FormBuilder);
  private filtersStore = inject(FiltersStore);
  private productStore = inject(ProductStore);
  private destroyRef = inject(DestroyRef);

  // Signals з store
  hasActiveFilters = this.filtersStore.hasActiveFilters;
  activeFiltersCount = this.filtersStore.activeFiltersCount;
  filteredCount = this.productStore.filteredProductsCount;
  totalCount = this.productStore.productsCount;

  form: FormGroup = this.fb.group({
    category: this.fb.control('all'),
    price: this.fb.group({
      min: this.fb.control(0),
      max: this.fb.control(0),
    }),
    inStock: this.fb.control(false),
    rating: this.fb.control(null),
  });

  categoryConfig: CheckboxConfig = {
    label: 'Категорія',
    type: 'radio',
    options: [
      { value: 'all', label: 'Всі товари' },
      { value: 'phones', label: 'Телефони', count: 124 },
      { value: 'laptops', label: 'Ноутбуки', count: 89 },
      { value: 'headphones', label: 'Навушники', count: 156 },
    ],
  };

  inStockConfig: CheckboxConfig = {
    label: 'Тільки в наявності',
    type: 'boolean',
  };

  ratingConfig: CheckboxConfig = {
    label: 'Рейтинг',
    type: 'radio',
    options: [
      { value: null, label: 'Всі' },
      { value: 5, label: '⭐⭐⭐⭐⭐' },
      { value: 4, label: '⭐⭐⭐⭐ і вище' },
      { value: 3, label: '⭐⭐⭐ і вище' },
    ],
  };
  constructor() {
    afterNextRender(() => {
      console.log('🚀 FilterPanel initialized');
      console.log('📋 Form:', this.form);
      console.log('📋 Form value:', this.form.value);
      this.handleFormChanges();
    });
  }

  // filter-panel.component.ts
  private handleFormChanges(): void {
    this.form.valueChanges
      .pipe(debounceTime(300), takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        console.log('📝 Form value changed:', value);

        if (value.price) {
          const hasPrice = value.price.min || value.price.max;
          const priceValue = hasPrice
            ? { min: value.price.min ?? 0, max: value.price.max ?? 0 }
            : null;
          console.log('💰 Setting price:', priceValue);
          this.filtersStore.setPrice(priceValue);
        }

        if (value.category !== undefined) {
          console.log('📂 Setting category:', value.category);
          this.filtersStore.setCategory(value.category);
        }

        if (value.inStock !== undefined) {
          console.log('📦 Setting inStock:', value.inStock);
          this.filtersStore.setInStock(value.inStock);
        }

        if (value.rating !== undefined) {
          console.log('⭐ Setting rating:', value.rating);
          this.filtersStore.setRating(value.rating);
        }

        // Перевірка store після змін
        console.log('🏪 Current store state:', {
          basic: this.filtersStore.basic(),
          dynamic: this.filtersStore.dynamic(),
        });
      });
  }

  reset(): void {
    this.form.reset({
      category: 'all',
      price: { min: 0, max: 0 },
      inStock: false,
      rating: null,
    });
    this.filtersStore.reset();
  }
}
