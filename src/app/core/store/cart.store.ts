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
    cartCount: computed(() => items().reduce((acc, item) => acc + item.quantity, 0)),

    totalPrice: computed(() => items().reduce((acc, item) => acc + item.totalPrice, 0)),
  })),

  withMethods((store) => {
    const dataService = inject(DataService);

    const persist = (): void => {
      const currentItems = store.items();
      dataService.saveLocalStorage<CartItem[]>(CART_STORAGE_KEY, currentItems);
    };

    const loadFromStorage = (): void => {
      const saved = dataService.loadLocalStorage<CartItem[]>(CART_STORAGE_KEY);
      if (saved && Array.isArray(saved)) {
        patchState(store, { items: saved });
      }
    };

    const calculateItemPrice = (product: Product, quantity: number): number => {
      const price = parseFloat(product.price);
      return price * quantity;
    };

    return {
      loadCart(): void {
        loadFromStorage();
      },

      addToCart(product: Product, quantity = 1): void {
        patchState(store, (state) => {
          const existing = state.items.find((item) => item.product.id === product.id);

          if (existing) {
            const newQuantity = existing.quantity + quantity;
            return {
              items: state.items.map((item) =>
                item.product.id === product.id
                  ? {
                      ...item,
                      quantity: newQuantity,
                      totalPrice: calculateItemPrice(product, newQuantity),
                    }
                  : item,
              ),
            };
          }

          const newItem: CartItem = {
            product,
            quantity,
            totalPrice: calculateItemPrice(product, quantity),
          };

          return {
            items: [...state.items, newItem],
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

      updateQuantity(productId: string, quantity: number): void {
        if (quantity <= 0) {
          this.removeFromCart(productId);
          return;
        }

        patchState(store, (state) => ({
          items: state.items.map((item) =>
            item.product.id === productId
              ? {
                  ...item,
                  quantity,
                  totalPrice: calculateItemPrice(item.product, quantity),
                }
              : item,
          ),
        }));
        persist();
      },

      increaseQuantity(productId: string): void {
        patchState(store, (state) => ({
          items: state.items.map((item) => {
            if (item.product.id === productId) {
              const newQuantity = item.quantity + 1;
              return {
                ...item,
                quantity: newQuantity,
                totalPrice: calculateItemPrice(item.product, newQuantity),
              };
            }
            return item;
          }),
        }));
        persist();
      },

      decreaseQuantity(productId: string): void {
        patchState(store, (state) => {
          const item = state.items.find((i) => i.product.id === productId);

          if (!item) return state;

          if (item.quantity <= 1) {
            return {
              items: state.items.filter((i) => i.product.id !== productId),
            };
          }

          return {
            items: state.items.map((i) => {
              if (i.product.id === productId) {
                const newQuantity = i.quantity - 1;
                return {
                  ...i,
                  quantity: newQuantity,
                  totalPrice: calculateItemPrice(i.product, newQuantity),
                };
              }
              return i;
            }),
          };
        });
        persist();
      },

      saveUpdatedItem(item: CartItem): void {
        patchState(store, (state) => ({
          items: state.items.map((it) => (it.product.id === item.product.id ? { ...item } : it)),
        }));
        persist();
      },

      clearCart(): void {
        patchState(store, { items: [] });
        persist();
      },

      checkout(): void {
        patchState(store, { items: [] });
        persist();
      },

      isInCart(productId: string): boolean {
        return store.items().some((item) => item.product.id === productId);
      },

      getItemQuantity(productId: string): number {
        const item = store.items().find((i) => i.product.id === productId);
        return item?.quantity ?? 0;
      },
    };
  }),
);
