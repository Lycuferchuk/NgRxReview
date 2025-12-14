import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NxsHeader } from './shared/components/nxs-header/nxs-header.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NxsHeader],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
