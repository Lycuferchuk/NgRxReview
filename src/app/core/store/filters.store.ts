import { computed } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { FilterPrimitive, FiltersState } from '../models/filter.model';
import { Category } from '../models/product.model';

const INITIAL_FILTERS_STATE: FiltersState = {
  basic: {
    searchQuery: '',
    category: null,
    brands: [],
    inStock: false,
    rating: null,
    priceMin: null,
    priceMax: null,
  },
  dynamic: {},
  loading: false,
  isDirty: false,
};
export const FiltersStore = signalStore(
  { providedIn: 'root' },

  withState<FiltersState>(INITIAL_FILTERS_STATE),

  withMethods((store) => ({
    setSearchQuery(query: string): void {
      patchState(store, (state) => ({
        basic: { ...state.basic, searchQuery: query },
        isDirty: true,
      }));
    },

    setCategory(category: Category | null): void {
      patchState(store, (state) => ({
        basic: { ...state.basic, category },
        dynamic: {},
        isDirty: true,
      }));
    },

    setBrands(brands: string[]): void {
      patchState(store, (state) => ({
        basic: { ...state.basic, brands },
        isDirty: true,
      }));
    },

    setInStock(inStock: boolean): void {
      patchState(store, (state) => ({
        basic: { ...state.basic, inStock },
        isDirty: true,
      }));
    },

    setRating(rating: number | null): void {
      patchState(store, (state) => ({
        basic: { ...state.basic, rating },
        isDirty: true,
      }));
    },

    setPriceRange(min: number | null, max: number | null): void {
      patchState(store, (state) => ({
        basic: { ...state.basic, priceMin: min, priceMax: max },
        isDirty: true,
      }));
    },

    setDynamicFilter(key: string, value: FilterPrimitive | FilterPrimitive[] | null): void {
      patchState(store, (state) => ({
        dynamic: { ...state.dynamic, [key]: value },
        isDirty: true,
      }));
    },

    removeDynamicFilter(key: string): void {
      patchState(store, (state) => {
        const { [key]: _, ...rest } = state.dynamic;
        return { dynamic: rest, isDirty: true };
      });
    },

    markAsApplied(): void {
      patchState(store, { isDirty: false });
    },

    reset(): void {
      patchState(store, INITIAL_FILTERS_STATE);
    },

    resetDynamic(): void {
      patchState(store, { dynamic: {}, isDirty: true });
    },

    setLoading(loading: boolean): void {
      patchState(store, { loading });
    },
  })),

  withComputed((state) => ({
    isDirty: state.isDirty,

    allFilters: computed(() => ({
      ...state.basic(),
      ...state.dynamic(),
    })),

    hasActiveFilters: computed(() => {
      const basic = state.basic();
      const dynamic = state.dynamic();

      return (
        basic.searchQuery.trim() !== '' ||
        basic.category !== null ||
        basic.brands.length > 0 ||
        basic.inStock ||
        basic.rating !== null ||
        basic.priceMin !== null ||
        basic.priceMax !== null ||
        Object.keys(dynamic).length > 0
      );
    }),

    activeFiltersCount: computed(() => {
      const basic = state.basic();
      const dynamic = state.dynamic();

      let count = 0;
      if (basic.searchQuery.trim() !== '') count++;
      if (basic.category !== null) count++;
      if (basic.brands.length > 0) count++;
      if (basic.inStock) count++;
      if (basic.rating !== null) count++;
      if (basic.priceMin !== null || basic.priceMax !== null) count++;
      count += Object.keys(dynamic).length;

      return count;
    }),
  })),
);
