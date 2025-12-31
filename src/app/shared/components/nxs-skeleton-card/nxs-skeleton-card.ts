import { Component } from '@angular/core';
import { MatCard, MatCardContent } from '@angular/material/card';

@Component({
  selector: 'app-nxs-skeleton-card',
  imports: [MatCard, MatCardContent],
  templateUrl: './nxs-skeleton-card.html',
  styleUrl: './nxs-skeleton-card.scss',
})
export class NxsSkeletonCard {}
