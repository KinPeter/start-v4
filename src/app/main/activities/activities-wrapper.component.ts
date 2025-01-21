import { Component, input } from '@angular/core';
import { StravaAthleteData } from './activities.types';
import { Activities } from '@kinpeter/pk-common';
import { ActivitiesMenuComponent } from './activities-menu.component';
import { ChoresComponent } from './chores.component';
import { CyclingGoalsCardComponent } from './cycling-goals-card.component';
import { WalkGoalsCardComponent } from './walk-goals-card.component';
import { CyclingStatsCardComponent } from './cycling-stats-card.component';

@Component({
  selector: 'pk-activities-wrapper',
  imports: [
    ActivitiesMenuComponent,
    ChoresComponent,
    CyclingGoalsCardComponent,
    WalkGoalsCardComponent,
    CyclingStatsCardComponent,
  ],
  providers: [],
  styles: ``,
  template: `
    <pk-activities-menu />
    <pk-walk-goals-card [stravaData]="stravaData()!" [activitiesData]="activitiesData()!" />
    <pk-cycling-goals-card [stravaData]="stravaData()!" [activitiesData]="activitiesData()!" />
    <pk-cycling-stats-card [stravaData]="stravaData()!" />
    <pk-chores [stravaData]="stravaData()!" [chores]="activitiesData()!.chores ?? []" />
  `,
})
export class ActivitiesWrapperComponent {
  public stravaData = input.required<StravaAthleteData>();
  public activitiesData = input.required<Activities>();
}
