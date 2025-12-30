import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { computed, inject } from '@angular/core';
import { ProductService } from '../services/product.service';
import { FiltersStore } from './filters.store';
import { Product } from '../models/product.model';

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

    const filteredProducts = computed(() => {
      const products = store.products();
      const basic = filtersStore.basic();
      const dynamic = filtersStore.dynamic();

      return products.filter((product) => {
        if (basic.searchQuery.trim() !== '') {
          const query = basic.searchQuery.toLowerCase();
          const productName = product.name.toLowerCase();

          if (!productName.includes(query)) {
            return false;
          }
        }

        if (basic.categories.length > 0) {
          if (!basic.categories.includes(product.category)) {
            return false;
          }
        }

        if (basic.brands.length > 0) {
          if (!basic.brands.includes(product.brand)) {
            return false;
          }
        }

        if (basic.inStock && !product.inStock) {
          return false;
        }

        if (basic.rating !== null) {
          const productRating = parseFloat(product.rating);
          if (productRating < basic.rating) {
            return false;
          }
        }

        for (const [key, filterValue] of Object.entries(dynamic)) {
          if (filterValue === undefined || filterValue === null) continue;

          const attrValue = product.attributes[key];
          if (attrValue === undefined) continue;

          if (typeof filterValue === 'boolean') {
            if (attrValue !== filterValue) {
              return false;
            }
          } else if (Array.isArray(filterValue)) {
            if (filterValue.length === 0) continue;

            const normalizedFilters = filterValue.map((v) => String(v));
            const normalizedAttr = String(attrValue);

            if (!normalizedFilters.includes(normalizedAttr)) {
              return false;
            }
          } else {
            if (String(attrValue) !== String(filterValue)) {
              return false;
            }
          }
        }

        return true;
      });
    });

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
            console.log('patch state');
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
