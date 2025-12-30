import { computed } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { BasicFilters, DynamicFilters, DynamicFilterValue } from '../models/filter.model';

interface FiltersState {
  basic: BasicFilters;
  dynamic: DynamicFilters;
  loading: boolean;
}

const initialState: FiltersState = {
  basic: {
    searchQuery: '',
    categories: [],
    brands: [],
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
    setSearchQuery(query: string): void {
      patchState(store, (state) => ({
        basic: { ...state.basic, searchQuery: query },
      }));
    },

    setCategories(categories: string[]): void {
      patchState(store, (state) => ({
        basic: { ...state.basic, categories },
        dynamic: {},
      }));
    },

    setBrands(brands: string[]): void {
      patchState(store, (state) => ({
        basic: { ...state.basic, brands },
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

    setDynamicFilter(key: string, value: DynamicFilterValue): void {
      patchState(store, (state) => ({
        dynamic: { ...state.dynamic, [key]: value },
      }));
    },

    setMultipleDynamicFilters(filters: DynamicFilters): void {
      patchState(store, (state) => ({
        dynamic: { ...state.dynamic, ...filters },
      }));
    },

    removeDynamicFilter(key: string): void {
      patchState(store, (state) => {
        const { [key]: removed, ...rest } = state.dynamic;
        return { dynamic: rest };
      });
    },

    reset(): void {
      patchState(store, initialState);
    },

    resetDynamic(): void {
      patchState(store, { dynamic: {} });
    },

    setLoading(loading: boolean): void {
      patchState(store, { loading });
    },
  })),

  withComputed((state) => ({
    allFilters: computed(() => ({
      ...state.basic(),
      ...state.dynamic(),
    })),

    hasActiveFilters: computed(() => {
      const basic = state.basic();
      const dynamic = state.dynamic();

      return (
        basic.searchQuery.trim() !== '' ||
        basic.categories.length > 0 ||
        basic.brands.length > 0 ||
        basic.inStock ||
        basic.rating !== null ||
        Object.keys(dynamic).length > 0
      );
    }),

    activeFiltersCount: computed(() => {
      const basic = state.basic();
      const dynamic = state.dynamic();

      let count = 0;
      if (basic.searchQuery.trim() !== '') count++;
      if (basic.categories.length > 0) count++;
      if (basic.brands.length > 0) count++;
      if (basic.inStock) count++;
      if (basic.rating !== null) count++;
      count += Object.keys(dynamic).length;

      return count;
    }),
  })),
);
