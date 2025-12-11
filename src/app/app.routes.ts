import { Routes } from '@angular/router';
import { ProductList } from './features/product-list/product-list';
import { ProductDetails } from './features/product-list/product-details/product-details';
import { CartComponent } from './features/cart/nxs-cart';

export const routes: Routes = [
  {
    path: 'products',
    component: ProductList,
  },
  {
    path: 'products/:productId/details',
    component: ProductDetails,
  },
  {
    path: 'cart',
    component: CartComponent,
  },
  { path: '', redirectTo: 'products', pathMatch: 'full' },
  { path: '**', redirectTo: 'products' },
];
