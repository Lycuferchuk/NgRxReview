import { Product } from '../models/product.model';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Filter } from '../models/filter.model';

export interface ProductState {
  products: Product[];
  loading: boolean;
  filters: Filter[];
}

const initialState: ProductState = {
  products: [],
  loading: false,
  filters: [],
};

export const ProductStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withMethods((store) => {
    const productService = inject(ProductService);

    return {
      loadProducts(): void {
        patchState(store, { loading: true });

        productService.getProductsList().subscribe({
          next: (products) => {
            patchState(store, {
              products,
              loading: false,
            });
          },
          error: () => {
            patchState(store, { loading: false });
          },
        });
      },

      setFilters(filters: Filter[]): void {
        patchState(store, { filters });
      },
    };
  }),
);
