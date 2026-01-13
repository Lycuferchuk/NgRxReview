import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { computed, inject } from '@angular/core';
import { ProductService } from '../services/product.service';
import { FiltersStore } from './filters.store';
import { Product } from '../models/product.model';

export interface ProductState {
  products: Product[];
  selectedProduct: Product | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  selectedProduct: null,
  loading: false,
  error: null,
};
export const ProductStore = signalStore(
  { providedIn: 'root' },

  withState(initialState),

  withComputed(({ products, selectedProduct, loading, error }) => ({
    productsCount: computed(() => products().length),
    selectedProduct,
    loading,
    hasError: computed(() => error() !== null),
  })),

  withMethods((store) => {
    const productService = inject(ProductService);
    const filtersStore = inject(FiltersStore);

    return {
      loadProducts(): void {
        patchState(store, { loading: true, error: null });

        const filters = {
          basic: filtersStore.basic(),
          dynamic: filtersStore.dynamic(),
        };

        productService.getProductsList(filters).subscribe({
          next: (products) => patchState(store, { products, loading: false }),
          error: (err) => patchState(store, { loading: false, error: err.message }),
        });
      },

      loadProductById(id: string): void {
        patchState(store, { loading: true, error: null, selectedProduct: null });

        productService.getProductById(id).subscribe({
          next: (product) =>
            patchState(store, {
              selectedProduct: product ?? null,
              loading: false,
            }),
          error: (err) =>
            patchState(store, {
              loading: false,
              error: err.message,
            }),
        });
      },

      clearSelectedProduct(): void {
        patchState(store, { selectedProduct: null });
      },
    };
  }),
);
