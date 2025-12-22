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

      console.log('🔍 Filtering products:', {
        totalProducts: products.length,
        filters: { basic, dynamic },
      });

      return products.filter((product) => {
        // Фільтр ціни
        if (basic.price !== null) {
          const min = basic.price.min ?? 0;
          const max = basic.price.max ?? Number.MAX_SAFE_INTEGER;

          if (product.price < min || product.price > max) {
            return false;
          }
        }

        // Фільтр категорії
        if (basic.category !== 'all' && product.category !== basic.category) {
          return false;
        }

        // Фільтр наявності
        if (basic.inStock && product.stock <= 0) {
          return false;
        }

        // Фільтр рейтингу
        if (basic.rating !== null && (product.rating ?? 0) < basic.rating) {
          return false;
        }

        // Динамічні фільтри
        if (!product.attributes) {
          return true; // Якщо немає атрибутів, пропускаємо динамічні фільтри
        }

        // Фільтр бренду (якщо є)
        if (dynamic.brand && dynamic.brand.length > 0) {
          if (!dynamic.brand.includes(product.brand)) {
            return false;
          }
        }

        // Фільтри для телефонів
        if (product.category === 'phones') {
          if (dynamic.screenSize && dynamic.screenSize.length > 0) {
            if (
              !product.attributes.screenSize ||
              !dynamic.screenSize.includes(product.attributes.screenSize)
            ) {
              return false;
            }
          }

          if (dynamic.battery && product.attributes.battery) {
            if (product.attributes.battery < dynamic.battery) {
              return false;
            }
          }

          if (dynamic.camera && dynamic.camera.length > 0) {
            if (
              !product.attributes.camera ||
              !dynamic.camera.some((c) => product.attributes?.camera?.includes(c))
            ) {
              return false;
            }
          }
        }

        // Фільтри для ноутбуків
        if (product.category === 'laptops') {
          if (dynamic.ram && dynamic.ram.length > 0) {
            if (!product.attributes.ram || !dynamic.ram.includes(product.attributes.ram)) {
              return false;
            }
          }

          if (dynamic.processor && dynamic.processor.length > 0) {
            if (
              !product.attributes.processor ||
              !dynamic.processor.includes(product.attributes.processor)
            ) {
              return false;
            }
          }

          if (dynamic.gpu && dynamic.gpu.length > 0) {
            if (!product.attributes.gpu || !dynamic.gpu.includes(product.attributes.gpu)) {
              return false;
            }
          }

          if (dynamic.storage && dynamic.storage.length > 0) {
            if (
              !product.attributes.storage ||
              !dynamic.storage.includes(product.attributes.storage)
            ) {
              return false;
            }
          }
        }

        // Фільтри для навушників
        if (product.category === 'headphones') {
          if (dynamic.type && dynamic.type.length > 0) {
            if (!product.attributes.type || !dynamic.type.includes(product.attributes.type)) {
              return false;
            }
          }

          if (dynamic.noiseCancelling !== undefined) {
            if (product.attributes.noiseCancelling !== dynamic.noiseCancelling) {
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
