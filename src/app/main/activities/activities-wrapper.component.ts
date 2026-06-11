import { Component, input, output } from '@angular/core';
import { ChoresComponent } from './chores.component';
import { CyclingGoalsCardComponent } from './cycling-goals-card.component';
import { WalkGoalsCardComponent } from './walk-goals-card.component';
import { Activities, UUID, StepsItem } from '../../types';
import { StepsCardComponent } from './steps-card.component';
import { StepsGoalsCardComponent } from './steps-goals-card.component';

@Component({
  selector: 'pk-activities-wrapper',
  imports: [
    ChoresComponent,
    CyclingGoalsCardComponent,
    WalkGoalsCardComponent,
    StepsCardComponent,
    StepsGoalsCardComponent,
  ],
  providers: [],
  styles: ``,
  template: `
    <pk-walk-goals-card [activitiesData]="activitiesData()!" />
    <pk-steps-goals-card [activitiesData]="activitiesData()!" />
    <pk-cycling-goals-card [activitiesData]="activitiesData()!" />
    <pk-steps-card [stepsData]="stepsData()!" />
    <pk-chores
      [currentBikeKms]="activitiesData().currentBikeKms"
      [chores]="activitiesData()!.chores ?? []"
      (edit)="editChore.emit($event)"
      (delete)="deleteChore.emit($event)" />
  `,
})
export class ActivitiesWrapperComponent {
  public activitiesData = input.required<Activities>();
  public stepsData = input.required<StepsItem[]>();
  public editChore = output<UUID>();
  public deleteChore = output<UUID>();
}
