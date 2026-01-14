import { Component, input } from '@angular/core';
import { EmptyStateType } from '../../../core/enums/empry-state.enum';
import { EmptyStateConfig } from '../../../core/models/empty-state-config.model';
import { EMPTY_STATE_MAP } from '../../../core/constants/empty-state.constants';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'nxs-no-data',
  imports: [NgOptimizedImage],
  templateUrl: './nxs-no-data.html',
  styleUrl: './nxs-no-data.scss',
})
export class NxsNoData {
  public type = input.required<EmptyStateType>();

  public get config(): EmptyStateConfig {
    return this.getEmptyStateConfig();
  }

  private getEmptyStateConfig(): EmptyStateConfig {
    return EMPTY_STATE_MAP[this.type()] ?? EMPTY_STATE_MAP[EmptyStateType.NO_DATA];
  }
}
