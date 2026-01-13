import { inject, Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { DataService } from './data.service';
import { AvailableFilterOptions, FiltersConfig } from '../models/filter.model';
import { FILTERS_JSON_KEY, FILTERS_OPTIONS_JSON_KEY } from '../constants/data-key.constants';

interface FiltersData {
  config: FiltersConfig;
  availableOptions: AvailableFilterOptions;
}

@Injectable({ providedIn: 'root' })
export class FiltersService {
  private readonly dataService = inject(DataService);

  public getFiltersConfig(): Observable<FiltersConfig> {
    return this.dataService.getDataFromJson<FiltersConfig>(FILTERS_JSON_KEY);
  }

  public loadFiltersData(): Observable<FiltersData> {
    return forkJoin({
      config: this.getFiltersConfig(),
      availableOptions:
        this.dataService.getDataFromJson<AvailableFilterOptions>(FILTERS_OPTIONS_JSON_KEY),
    });
  }
}
