import { Component, Input } from '@angular/core';
import { EMPTY_STATE_MAP, EmptyStateType } from '../../../core/enums/empry-state.enum';
import { EmptyStateConfig } from '../../../core/models/empty-state-config.model';

@Component({
  selector: 'app-nxs-no-data',
  imports: [],
  templateUrl: './nxs-no-data.html',
  styleUrl: './nxs-no-data.scss',
})
export class NxsNoData {
  @Input() type!: EmptyStateType;

  public get config(): EmptyStateConfig {
    return EMPTY_STATE_MAP[this.type];
  }
}
