import { Routes } from '@angular/router';
import {ProductList} from './features/product-list/product-list';
import {ProductDetails} from './features/product-list/product-details/product-details';
import {Cart} from './features/cart/cart';

export const routes: Routes = [
  {
    path: "products",
    component: ProductList,
    children: [
      { path: ":productId/details", component: ProductDetails}
    ]
  },
  {
    path: "cart",
    component: Cart,
  },
  { path: "", redirectTo: "products", pathMatch: "full" },
  { path: "**", redirectTo: "products" },
];
