import { Component, input, output } from '@angular/core';
import { ChoreComponent } from './chore.component';
import { CyclingChore, StravaAthleteData, UUID } from '../../types';

@Component({
  selector: 'pk-chores',
  imports: [ChoreComponent],
  providers: [],
  styles: ``,
  template: `
    @for (chore of chores(); track chore.id) {
      <pk-chore
        [stravaData]="stravaData()"
        [chore]="chore"
        (edit)="edit.emit($event)"
        (delete)="delete.emit($event)" />
    }
  `,
})
export class ChoresComponent {
  public stravaData = input.required<StravaAthleteData>();
  public chores = input.required<CyclingChore[]>();

  public edit = output<UUID>();
  public delete = output<UUID>();
}
