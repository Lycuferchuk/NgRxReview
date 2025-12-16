import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NxsHeader } from './shared/components/nxs-header/nxs-header.component';
import { CartStore } from './core/store/cart.store';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NxsHeader],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  cart = inject(CartStore);

  public ngOnInit(): void {
    this.cart.loadCart();
  }
}
