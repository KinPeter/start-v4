import { Component, input, output, signal } from '@angular/core';
import { Note, UUID } from '@kinpeter/pk-common';
import { NgIcon } from '@ng-icons/core';
import { DatePipe, NgClass } from '@angular/common';
import { PkIconButtonComponent } from '../../common/pk-icon-button.component';
import { PkCardDirective } from '../../common/pk-card.directive';

@Component({
  selector: 'pk-note',
  imports: [NgIcon, NgClass, PkIconButtonComponent, DatePipe, PkCardDirective],
  providers: [],
  styles: `
    .card {
      white-space: pre-wrap;

      ul.links {
        list-style-type: none;
        margin-top: 0.35rem;
      }

      &.pinned {
        border-color: var(--color-text);
      }

      &.archived {
        opacity: 0.6;
      }

      footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 0.35rem;

        .date {
          font-size: 0.65rem;
        }

        .actions {
          display: flex;
        }
      }
    }
  `,
  template: `
    <div pkCard class="card" [ngClass]="{ pinned: note()?.pinned, archived: note()?.archived }">
      @if (note()?.text) {
        <p class="text">{{ note()?.text }}</p>
      }
      @if (note()?.links?.length) {
        <ul class="links">
          @for (link of note()?.links; track link.url) {
            <li>
              <a [href]="link.url" target="_blank">
                <ng-icon name="tablerLink" />
                {{ link.name }}</a
              >
            </li>
          }
        </ul>
      }
      <footer>
        <div class="date">{{ note()?.createdAt | date: 'yyyy.MM.dd H:mm' }}</div>
        <div class="actions">
          @if (!confirmState()) {
            <pk-icon-button tooltip="Edit" (onClick)="edit.emit(note()?.id!)">
              <ng-icon name="tablerEdit" size="1rem" />
            </pk-icon-button>
            <pk-icon-button
              [tooltip]="note()?.pinned ? 'Unpin' : 'Pin'"
              [disabled]="note()?.archived ?? false"
              (onClick)="pin.emit(note()?.id!)">
              <ng-icon [name]="note()?.pinned ? 'tablerPinnedOff' : 'tablerPinned'" size="1rem" />
            </pk-icon-button>
            <pk-icon-button
              [tooltip]="note()?.archived ? 'Unarchive' : 'Archive'"
              [disabled]="note()?.pinned ?? false"
              (onClick)="archive.emit(note()?.id!)">
              <ng-icon
                [name]="note()?.archived ? 'tablerArchiveOff' : 'tablerArchive'"
                size="1rem" />
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
              (onClick)="delete.emit(note()?.id!)">
              <ng-icon name="tablerTrash" size="1rem" />
            </pk-icon-button>
          }
        </div>
      </footer>
    </div>
  `,
})
export class NoteComponent {
  public note = input<Note>();

  public edit = output<UUID>();
  public pin = output<UUID>();
  public archive = output<UUID>();
  public delete = output<UUID>();

  public confirmState = signal(false);
}
