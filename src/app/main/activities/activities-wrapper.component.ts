import { Component, input } from '@angular/core';
import { StravaAthleteData } from './activities.types';
import { Activities } from '@kinpeter/pk-common';
import { ActivitiesMenuComponent } from './activities-menu.component';
import { ChoresComponent } from './chores.component';
import { CyclingCardComponent } from './cycling-card.component';
import { WalkCardComponent } from './walk-card.component';

@Component({
  selector: 'pk-activities-wrapper',
  imports: [ActivitiesMenuComponent, ChoresComponent, CyclingCardComponent, WalkCardComponent],
  providers: [],
  styles: ``,
  template: `
    <pk-activities-menu />
    <pk-walk-card [stravaData]="stravaData()!" [activitiesData]="activitiesData()!" />
    <pk-cycling-card [stravaData]="stravaData()!" [activitiesData]="activitiesData()!" />
    <pk-chores [stravaData]="stravaData()!" [chores]="activitiesData()!.chores ?? []" />
  `,
})
export class ActivitiesWrapperComponent {
  public stravaData = input.required<StravaAthleteData>();
  public activitiesData = input.required<Activities>();
}
