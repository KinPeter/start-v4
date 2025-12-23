import { Component, input, output, signal } from '@angular/core';
import { PkCardDirective } from '../../common/pk-card.directive';
import { NgIcon } from '@ng-icons/core';
import { PkIconButtonComponent } from '../../common/pk-icon-button.component';
import { DocumentListItem, UUID } from '../../types';

@Component({
  selector: 'pk-doc-card',
  imports: [PkCardDirective, NgIcon, PkIconButtonComponent],
  styles: `
    .card {
      display: flex;
      justify-content: space-between;
    }

    .title-button {
      font-size: 1rem;
      font-weight: 700;
      padding: 8px;
      margin: 1px;
      border-radius: 16px;

      &:hover {
        color: var(--color-text-accent);
      }
    }

    .tags {
      padding: 4px 8px;
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
    }

    .tag {
      background-color: var(--color-border);
      color: var(--color-text-secondary);
      font-size: 0.8rem;
      padding: 4px 10px;
      margin-right: 4px;
      border-radius: 12px;
    }

    .actions {
      display: flex;
    }
  `,
  template: `
    <div pkCard class="card">
      <main>
        <button class="title-button" (click)="open.emit(item()?.id!)">{{ item()?.title }}</button>
        <div class="tags">
          @for (tag of item()?.tags; track tag) {
            <span class="tag">{{ tag }}</span>
          }
        </div>
      </main>
      <div class="actions">
        @if (!confirmState()) {
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
            (onClick)="delete.emit(item()?.id!)">
            <ng-icon name="tablerTrash" size="1rem" />
          </pk-icon-button>
        }
      </div>
    </div>
  `,
})
export class DocCardComponent {
  public item = input<DocumentListItem>();

  public open = output<UUID>();
  public delete = output<UUID>();

  public confirmState = signal(false);
}
