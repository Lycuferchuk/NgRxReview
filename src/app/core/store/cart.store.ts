import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { CartItem, CartState } from '../models/cart-item.model';
import { computed, inject } from '@angular/core';
import { Product } from '../models/product.model';
import { DataService } from '../services/data.service';
import { CART_STORAGE_KEY } from '../constants/storage-key.constants';
import { SnackbarService } from '../services/snackbar.service';

const INITIAL_CART_STATE: CartState = {
  items: [],
};

export const CartStore = signalStore(
  { providedIn: 'root' },

  withState(INITIAL_CART_STATE),

  withComputed(({ items }) => ({
    cartCount: computed(() => items().reduce((acc, item) => acc + item.quantity, 0)),
    totalPrice: computed(() => items().reduce((acc, item) => acc + Number(item.totalPrice), 0)),
    isEmpty: computed(() => items().length === 0),
    isInCart: computed(
      () => (productId: string) => items().some((item) => item.product.id === productId),
    ),
    getQuantity: computed(
      () => (productId: string) =>
        items().find((item) => item.product.id === productId)?.quantity ?? 0,
    ),
  })),

  withMethods((store) => {
    const dataService = inject(DataService);
    const snackbarService = inject(SnackbarService);

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

      addToCart(product: Product): void {
        const existing = store.items().find((item) => item.product.id === product.id);

        if (existing) {
          this.incrementQuantity(product.id);
          snackbarService.success(`${product.name} додано в кошик`);
          return;
        }

        patchState(store, (state) => ({
          items: [...state.items, { product, quantity: 1, totalPrice: product.price }],
        }));
        persist();
        snackbarService.success(`${product.name} додано в кошик`);
      },

      removeFromCart(productId: string): void {
        const item = store.items().find((i) => i.product.id === productId);
        patchState(store, (state) => ({
          items: state.items.filter((i) => i.product.id !== productId),
        }));
        persist();
        if (item) {
          snackbarService.info(`${item.product.name} видалено з кошика`);
        }
      },

      updateQuantity(productId: string, quantity: number): void {
        if (quantity <= 0) return;

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
        snackbarService.success('Замовлення оформлено!');
      },
    };
  }),
);
