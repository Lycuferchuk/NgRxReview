import { Component } from '@angular/core';
import { PipHeader } from '../../shared/components/pip-header/pip-header';

@Component({
  selector: 'app-cart',
  imports: [PipHeader],
  templateUrl: './cart.html',
  styleUrl: './cart.scss',
})
export class Cart {}
