import { signalStore, withState, withMethods, patchState, withComputed } from '@ngrx/signals';
import { PriceRange } from '../models/filter.model';
import { computed } from '@angular/core';

export interface BasicFilters {
  price: PriceRange | null;
  category: string;
  inStock: boolean;
  rating: number | null;
}

export interface DynamicFilters {
  // Для телефонів
  screenSize?: string[];
  battery?: number;
  camera?: string[];

  // Для ноутбуків
  ram?: string[];
  processor?: string[];
  gpu?: string[];
  storage?: string[];

  // Для навушників
  type?: string[]; // over-ear, in-ear
  noiseCancelling?: boolean;

  // Загальні
  brand?: string[];
  [key: string]: any;
}

export interface FiltersState {
  basic: BasicFilters;
  dynamic: DynamicFilters;
  loading: boolean;
}

const initialState: FiltersState = {
  basic: {
    price: null,
    category: 'all',
    inStock: false,
    rating: null,
  },
  dynamic: {},
  loading: false,
};

export const FiltersStore = signalStore(
  { providedIn: 'root' },
  withState<FiltersState>(initialState),

  withMethods((store) => ({
    setPrice(price: PriceRange | null): void {
      patchState(store, (state) => ({
        basic: { ...state.basic, price },
      }));
    },

    setCategory(category: string): void {
      patchState(store, (state) => ({
        basic: { ...state.basic, category },
        dynamic: {}, // Скидаємо динамічні фільтри при зміні категорії
      }));
    },

    setInStock(inStock: boolean): void {
      patchState(store, (state) => ({
        basic: { ...state.basic, inStock },
      }));
    },

    setRating(rating: number | null): void {
      patchState(store, (state) => ({
        basic: { ...state.basic, rating },
      }));
    },

    setDynamicFilter(key: string, value: any): void {
      patchState(store, (state) => ({
        dynamic: { ...state.dynamic, [key]: value },
      }));
    },

    setMultipleDynamicFilters(filters: DynamicFilters): void {
      patchState(store, (state) => ({
        dynamic: { ...state.dynamic, ...filters },
      }));
    },

    reset(): void {
      patchState(store, initialState);
    },

    resetDynamic(): void {
      patchState(store, () => ({
        dynamic: {},
      }));
    },
  })),

  withComputed((state) => ({
    // Всі активні фільтри в одному об'єкті
    allFilters: computed(() => ({
      ...state.basic(),
      ...state.dynamic(),
    })),

    // Чи є активні фільтри
    hasActiveFilters: computed(() => {
      const basic = state.basic();
      const dynamic = state.dynamic();

      return (
        basic.price !== null ||
        basic.category !== 'all' ||
        basic.inStock ||
        basic.rating !== null ||
        Object.keys(dynamic).length > 0
      );
    }),

    // Кількість активних фільтрів
    activeFiltersCount: computed(() => {
      const basic = state.basic();
      const dynamic = state.dynamic();

      let count = 0;

      if (basic.price !== null) count++;
      if (basic.category !== 'all') count++;
      if (basic.inStock) count++;
      if (basic.rating !== null) count++;
      count += Object.keys(dynamic).length;

      return count;
    }),
  })),
);
