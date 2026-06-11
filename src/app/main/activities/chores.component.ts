import { Component, input, output } from '@angular/core';
import { ChoreComponent } from './chore.component';
import { CyclingChore, UUID } from '../../types';

@Component({
  selector: 'pk-chores',
  imports: [ChoreComponent],
  providers: [],
  styles: ``,
  template: `
    @for (chore of chores(); track chore.id) {
      <pk-chore
        [currentBikeKms]="currentBikeKms()"
        [chore]="chore"
        (edit)="edit.emit($event)"
        (delete)="delete.emit($event)" />
    }
  `,
})
export class ChoresComponent {
  public currentBikeKms = input.required<number>();
  public chores = input.required<CyclingChore[]>();

  public edit = output<UUID>();
  public delete = output<UUID>();
}
