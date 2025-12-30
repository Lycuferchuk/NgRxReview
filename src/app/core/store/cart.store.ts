import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { CartItem, CartState } from '../models/cart-item.model';
import { computed, inject } from '@angular/core';
import { Product } from '../models/product.model';
import { DataService } from '../services/data.service';
import { CART_STORAGE_KEY } from '../constants/storage-key.constants';

const INITIAL_CART_STATE: CartState = {
  items: [],
};

export const CartStore = signalStore(
  { providedIn: 'root' },

  withState(INITIAL_CART_STATE),

  withComputed(({ items }) => ({
    cartCount: computed(() => items().reduce((acc, item) => acc + item.quantity, 0)),
    totalPrice: computed(() => items().reduce((acc, item) => acc + item.totalPrice, 0)),
    isEmpty: computed(() => items().length === 0),
  })),

  withMethods((store) => {
    const dataService = inject(DataService);

    const persist = (): void => {
      dataService.saveLocalStorage<CartItem[]>(CART_STORAGE_KEY, store.items());
    };

    const calculateTotalPrice = (price: number, quantity: number): number => {
      return price * quantity;
    };

    return {
      loadCart(): void {
        const saved = dataService.loadLocalStorage<CartItem[]>(CART_STORAGE_KEY);
        if (saved && Array.isArray(saved)) {
          patchState(store, { items: saved });
        }
      },

      addToCart(product: Product, quantity = 1): void {
        patchState(store, (state) => {
          const existingIndex = state.items.findIndex((item) => item.product.id === product.id);

          if (existingIndex !== -1) {
            // Оновлюємо існуючий елемент
            const existing = state.items[existingIndex];
            const newQuantity = existing.quantity + quantity;
            const updatedItems = [...state.items];
            updatedItems[existingIndex] = {
              ...existing,
              quantity: newQuantity,
              totalPrice: calculateTotalPrice(product.price, newQuantity),
            };
            return { items: updatedItems };
          }

          // Додаємо новий елемент
          const newItem: CartItem = {
            product,
            quantity,
            totalPrice: calculateTotalPrice(product.price, quantity),
          };
          return { items: [...state.items, newItem] };
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
                  totalPrice: calculateTotalPrice(item.product.price, quantity),
                }
              : item,
          ),
        }));
        persist();
      },

      incrementQuantity(productId: string): void {
        const item = store.items().find((i) => i.product.id === productId);
        if (item) {
          this.updateQuantity(productId, item.quantity + 1);
        }
      },

      decrementQuantity(productId: string): void {
        const item = store.items().find((i) => i.product.id === productId);
        if (item && item.quantity > 1) {
          this.updateQuantity(productId, item.quantity - 1);
        }
      },

      clearCart(): void {
        patchState(store, { items: [] });
        persist();
      },

      checkout(): void {
        if (store.items().length === 0) return;
        this.clearCart();
      },
    };
  }),
);
