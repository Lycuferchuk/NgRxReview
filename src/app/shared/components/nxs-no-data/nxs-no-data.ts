import { Component, Input } from '@angular/core';
import { EmptyStateType } from '../../../core/enums/empry-state.enum';
import { EmptyStateConfig } from '../../../core/models/empty-state-config.model';
import { EMPTY_STATE_MAP } from '../../../core/constants/empty-state.constants';

@Component({
  selector: 'app-nxs-no-data',
  imports: [],
  templateUrl: './nxs-no-data.html',
  styleUrl: './nxs-no-data.scss',
})
export class NxsNoData {
  @Input() type!: EmptyStateType;

  public get config(): EmptyStateConfig {
    return this.getEmptyStateConfig(this.type);
  }

  private getEmptyStateConfig(type: EmptyStateType): EmptyStateConfig {
    return EMPTY_STATE_MAP[type] ?? EMPTY_STATE_MAP[EmptyStateType.NO_DATA];
  }
}
