import { Component, input, output, signal } from '@angular/core';
import { PkCardDirective } from '../../common/pk-card.directive';
import { NgIcon } from '@ng-icons/core';
import { PkIconButtonComponent } from '../../common/pk-icon-button.component';
import { NotificationService } from '../../services/notification.service';
import { PersonalData, UUID } from '../../types';

@Component({
  selector: 'pk-personal-data-card',
  imports: [PkCardDirective, NgIcon, PkIconButtonComponent],
  styles: `
    .card {
      display: flex;
      justify-content: space-between;
    }

    .actions {
      display: flex;
    }
  `,
  template: `
    <div pkCard class="card">
      <main>
        <p>
          <b>{{ data()?.name }}</b>
        </p>
        <p>{{ data()?.identifier }}</p>
        @if (data()?.expiry) {
          <p>Expiry: {{ data()?.expiry }}</p>
        }
      </main>
      @if (!hideActions()) {
        <div class="actions">
          @if (!confirmState()) {
            <pk-icon-button tooltip="Edit" (onClick)="edit.emit(data()?.id!)">
              <ng-icon name="tablerEdit" size="1rem" />
            </pk-icon-button>
            <pk-icon-button tooltip="Copy" (onClick)="copy()">
              <ng-icon [name]="showCheckmark() ? 'tablerCheck' : 'tablerCopy'" size="1rem" />
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
              (onClick)="delete.emit(data()?.id!)">
              <ng-icon name="tablerTrash" size="1rem" />
            </pk-icon-button>
          }
        </div>
      } @else {
        <div class="actions">
          <pk-icon-button tooltip="Copy" (onClick)="copy()">
            <ng-icon [name]="showCheckmark() ? 'tablerCheck' : 'tablerCopy'" size="1rem" />
          </pk-icon-button>
        </div>
      }
    </div>
  `,
})
export class PersonalDataCardComponent {
  public data = input<PersonalData>();
  public hideActions = input<boolean>(false);

  public edit = output<UUID>();
  public delete = output<UUID>();

  public confirmState = signal(false);
  public showCheckmark = signal(false);

  constructor(private notificationService: NotificationService) {}

  public async copy(): Promise<void> {
    try {
      const data = this.data();
      if (!data) return;
      await navigator.clipboard.writeText(data.identifier);
      this.showCheckmark.set(true);
      setTimeout(() => {
        this.showCheckmark.set(false);
      }, 3000);
    } catch (_e) {
      this.notificationService.showError('Could not copy to clipboard.');
    }
  }
}
