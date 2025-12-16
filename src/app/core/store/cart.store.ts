import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { CartItem } from '../models/cart-item.model';
import { computed, inject } from '@angular/core';
import { Product } from '../models/product.model';
import { DataService } from '../services/data.service';
import { CART_STORAGE_KEY } from '../constants/storage-key.constants';

export interface CartState {
  items: CartItem[];
}

const initCart: CartState = {
  items: [],
};

export const CartStore = signalStore(
  { providedIn: 'root' },

  withState(initCart),

  withComputed(({ items }) => ({
    cartCount: computed(() => items().reduce((acc, i) => acc + i.quantity, 0)),

    totalPrice: computed(() => items().reduce((acc, i) => acc + i.totalPrice, 0)),

    itemsSignal: computed(() => items()),
  })),

  withMethods((store) => {
    const dataService = inject(DataService);

    const persist = (): void => {
      const currentItems = store.items;
      dataService.saveLocalStorage<CartItem[]>(CART_STORAGE_KEY, currentItems());
    };

    const loadFromStorage = (): void => {
      const saved = dataService.loadLocalStorage<CartItem[]>(CART_STORAGE_KEY) ?? [];
      patchState(store, { items: saved });
    };

    return {
      loadCart(): void {
        loadFromStorage();
      },

      addToCart(product: Product, quantity = 1): void {
        patchState(store, (state) => {
          const existing = state.items.find((item) => item.product.id === product.id);

          if (existing) {
            return {
              items: state.items.map((item) =>
                item.product.id === product.id
                  ? {
                      ...item,
                      quantity: item.quantity + quantity,
                      totalPrice: item.totalPrice + product.price * quantity,
                    }
                  : item,
              ),
            };
          }

          return {
            items: [...state.items, { product, quantity, totalPrice: product.price * quantity }],
          };
        });

        persist();
      },

      removeFromCart(productId: string): void {
        patchState(store, (state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }));
        persist();
      },

      saveUpdatedItem(item: CartItem): void {
        patchState(store, (state) => ({
          items: state.items.map((it) => (it.product.id === item.product.id ? { ...item } : it)),
        }));
        persist();
      },

      checkout(): void {
        patchState(store, { items: [] });
        persist();
      },
    };
  }),
);
