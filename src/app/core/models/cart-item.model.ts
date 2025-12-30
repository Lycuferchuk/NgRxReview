import { Product } from './product.model';

export interface CartItem {
  product: Product;
  quantity: number;
  totalPrice: number;
}

export interface CartState {
  items: CartItem[];
}
