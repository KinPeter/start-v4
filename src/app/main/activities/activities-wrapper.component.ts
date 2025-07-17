import { Component, input, output } from '@angular/core';
import { ChoresComponent } from './chores.component';
import { CyclingGoalsCardComponent } from './cycling-goals-card.component';
import { WalkGoalsCardComponent } from './walk-goals-card.component';
import { CyclingStatsCardComponent } from './cycling-stats-card.component';
import { Activities, UUID, StravaAthleteData } from '../../types';

@Component({
  selector: 'pk-activities-wrapper',
  imports: [
    ChoresComponent,
    CyclingGoalsCardComponent,
    WalkGoalsCardComponent,
    CyclingStatsCardComponent,
  ],
  providers: [],
  styles: ``,
  template: `
    <pk-walk-goals-card [stravaData]="stravaData()!" [activitiesData]="activitiesData()!" />
    <pk-cycling-goals-card [stravaData]="stravaData()!" [activitiesData]="activitiesData()!" />
    <pk-cycling-stats-card [stravaData]="stravaData()!" />
    <pk-chores
      [stravaData]="stravaData()!"
      [chores]="activitiesData()!.chores ?? []"
      (edit)="editChore.emit($event)"
      (delete)="deleteChore.emit($event)" />
  `,
})
export class ActivitiesWrapperComponent {
  public stravaData = input.required<StravaAthleteData>();
  public activitiesData = input.required<Activities>();
  public editChore = output<UUID>();
  public deleteChore = output<UUID>();
}
