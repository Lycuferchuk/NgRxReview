import { Component } from '@angular/core';
import { MatCard } from '@angular/material/card';
import { MatExpansionPanel, MatExpansionPanelHeader } from '@angular/material/expansion';
import { MatDivider } from '@angular/material/divider';

@Component({
  selector: 'app-nxs-skeleton-filter',
  imports: [MatCard, MatExpansionPanel, MatExpansionPanelHeader, MatDivider],
  templateUrl: './nxs-skeleton-filter.html',
  styleUrl: './nxs-skeleton-filter.scss',
})
export class NxsSkeletonFilter {
  filterGroups = [
    { options: [1, 2, 3, 4] }, // Категорія - 4 опції
    { options: [1, 2] }, // Ціна - 2 інпути
    { options: [1] }, // В наявності - 1 checkbox
    { options: [1, 2, 3, 4] }, // Рейтинг - 4 опції
  ];
}
