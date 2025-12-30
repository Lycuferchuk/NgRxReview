import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { computed, inject } from '@angular/core';
import { ProductService } from '../services/product.service';
import { FiltersStore } from './filters.store';
import { Product } from '../models/product.model';
import { filterProducts } from '../utils/filter.util';

export interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  loading: false,
  error: null,
};

export const ProductStore = signalStore(
  { providedIn: 'root' },

  withState(initialState),

  withComputed((store) => {
    const filtersStore = inject(FiltersStore);

    const filteredProducts = computed(() =>
      filterProducts(store.products(), filtersStore.basic(), filtersStore.dynamic()),
    );

    return {
      filteredProducts,
      productsCount: computed(() => store.products().length),
      filteredProductsCount: computed(() => filteredProducts().length),
      isLoading: computed(() => store.loading()),
      hasError: computed(() => store.error() !== null),
    };
  }),

  withMethods((store) => {
    const productService = inject(ProductService);

    return {
      loadProducts(): void {
        patchState(store, { loading: true, error: null });

        productService.getProductsList().subscribe({
          next: (products) => {
            patchState(store, {
              products,
              loading: false,
              error: null,
            });
          },
          error: (error) => {
            patchState(store, {
              loading: false,
              error: error.message || 'Помилка завантаження продуктів',
            });
          },
        });
      },

      clearError(): void {
        patchState(store, { error: null });
      },
    };
  }),
);
