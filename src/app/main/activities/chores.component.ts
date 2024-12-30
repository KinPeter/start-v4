import { Component, input } from '@angular/core';
import { StravaAthleteData } from './activities.types';
import { CyclingChore } from '@kinpeter/pk-common';
import { PkCardDirective } from '../../common/pk-card.directive';

@Component({
  selector: 'pk-chores',
  imports: [PkCardDirective],
  providers: [],
  styles: ``,
  template: `
    @for (chore of chores(); track chore.id) {
      <div pkCard class="card"></div>
    }
  `,
})
export class ChoresComponent {
  public stravaData = input.required<StravaAthleteData>();
  public chores = input.required<CyclingChore[]>();
}
