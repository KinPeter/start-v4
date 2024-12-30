import { Component, input } from '@angular/core';
import { PkCardDirective } from '../../common/pk-card.directive';
import { StravaAthleteData } from './activities.types';
import { Activities } from '@kinpeter/pk-common';

@Component({
  selector: 'pk-cycling-card',
  imports: [PkCardDirective],
  providers: [],
  styles: ``,
  template: ` <div pkCard class="card"></div> `,
})
export class CyclingCardComponent {
  public stravaData = input.required<StravaAthleteData>();
  public activitiesData = input.required<Activities>();
}
