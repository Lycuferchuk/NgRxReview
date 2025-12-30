import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'products',
    loadComponent: () => import('./features/product-list/product-list').then((m) => m.ProductList),
  },
  {
    path: 'products/:productId/details',
    loadComponent: () =>
      import('./features/product-list/product-details/product-details').then(
        (m) => m.ProductDetails,
      ),
  },
  {
    path: 'cart',
    loadComponent: () => import('./features/cart/nxs-cart').then((m) => m.CartComponent),
  },
  {
    path: '',
    redirectTo: 'products',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'products',
  },
];
