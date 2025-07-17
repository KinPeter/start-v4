import { Component, input, output, signal } from '@angular/core';
import { CircularProgressComponent } from '../../common/circular-progress.component';
import { DecimalPipe } from '@angular/common';
import { NgIcon } from '@ng-icons/core';
import { PkCardDirective } from '../../common/pk-card.directive';
import { PkIconButtonComponent } from '../../common/pk-icon-button.component';
import { CyclingChore } from '../../types/activities';
import { UUID, StravaAthleteData } from '../../types';

@Component({
  selector: 'pk-chore',
  imports: [CircularProgressComponent, DecimalPipe, NgIcon, PkCardDirective, PkIconButtonComponent],
  providers: [],
  styles: `
    .card {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    h3 {
      font-weight: 500;
    }

    .text {
      margin-bottom: 0.25rem;
    }

    .alert {
      ng-icon {
        color: var(--color-error);
      }
    }

    .actions {
      margin-left: -0.25rem;
      display: flex;
    }
  `,
  template: `
    <div pkCard class="card">
      <div>
        <div class="text">
          <h3>{{ chore().name }}</h3>
          <p>
            {{ stravaData().primaryBike.distance - chore().lastKm | number: '1.0-2' }} /
            {{ chore().kmInterval }}km
          </p>
        </div>

        <div class="actions">
          @if (!confirmState()) {
            <pk-icon-button tooltip="Edit" (onClick)="edit.emit(chore().id)">
              <ng-icon name="tablerEdit" size="1rem" />
            </pk-icon-button>
            <pk-icon-button tooltip="Delete" (onClick)="confirmState.set(true)">
              <ng-icon name="tablerTrash" size="1rem" />
            </pk-icon-button>
          } @else {
            <pk-icon-button tooltip="Cancel" variant="subtle" (onClick)="confirmState.set(false)">
              <ng-icon name="tablerX" size="1rem" />
            </pk-icon-button>
            <pk-icon-button
              tooltip="Confirm delete"
              variant="filled"
              (onClick)="delete.emit(chore().id)">
              <ng-icon name="tablerTrash" size="1rem" />
            </pk-icon-button>
          }
        </div>
      </div>

      @if (stravaData().primaryBike.distance >= chore().lastKm + chore().kmInterval) {
        <div class="alert">
          <ng-icon name="tablerAlertTriangle" size="2rem" />
        </div>
      }

      <div>
        <pk-circular-progress
          [percentage]="
            ((stravaData().primaryBike.distance - chore().lastKm) / chore().kmInterval) * 100
          "
          [radius]="32" />
      </div>
    </div>
  `,
})
export class ChoreComponent {
  public stravaData = input.required<StravaAthleteData>();
  public chore = input.required<CyclingChore>();

  public edit = output<UUID>();
  public delete = output<UUID>();

  public confirmState = signal(false);
}
