import { Component, input, output, signal } from '@angular/core';
import { PkModalComponent } from '../../common/pk-modal.component';
import { Document, DocumentRequest } from '../../types';
import { PkIconButtonComponent } from '../../common/pk-icon-button.component';
import { NgIcon } from '@ng-icons/core';
import { DocFormComponent } from './doc-form.component';
import { MarkedPipe } from '../../common/marked.pipe';

@Component({
  selector: 'pk-doc-modal',
  imports: [PkModalComponent, DocFormComponent, PkIconButtonComponent, NgIcon, MarkedPipe],
  styles: `
    .modal-content {
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .modal-header {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      padding-bottom: 16px;
      padding-right: 32px;
      flex-wrap: wrap;
      border-bottom: 1px solid var(--color-border);
    }

    .modal-body {
      flex: 1;
      padding: 16px 0;
      overflow-y: auto;
    }

    .title {
      font-size: 1.5rem;
      font-weight: 700;
      margin-right: 16px;
    }

    .header-button {
      margin-right: 16px;
    }

    .tag {
      background-color: var(--color-border);
      color: var(--color-text-secondary);
      font-size: 0.8rem;
      padding: 4px 10px;
      margin-right: 4px;
      border-radius: 12px;
    }
  `,
  template: `
    <pk-modal (close)="close.emit()">
      <div class="modal-content">
        <div class="modal-header">
          <span class="title">{{ document()?.title ?? 'New document' }}</span>
          @if (document() && !isNew() && !isEditMode() && !isReadOnly()) {
            <pk-icon-button
              tooltip="Edit"
              variant="subtle"
              class="header-button"
              (onClick)="toggleEditMode()">
              <ng-icon name="tablerEdit" size="1.5rem" />
            </pk-icon-button>
          }
          @for (tag of document()?.tags; track tag) {
            <span class="tag">{{ tag }}</span>
          }
        </div>
        <div class="modal-body">
          @if (isEditMode() || isNew()) {
            <pk-doc-form
              [document]="document()"
              (cancel)="cancelEdit()"
              (save)="save.emit($event)"></pk-doc-form>
          } @else {
            <div class="markdown-text" [innerHTML]="document()?.content ?? '' | marked"></div>
          }
        </div>
      </div>
    </pk-modal>
  `,
})
export class DocModalComponent {
  public document = input<Document | null>(null);
  public isNew = input<boolean>(false);
  public isReadOnly = input<boolean>(false);
  public close = output<void>();
  public save = output<DocumentRequest>();

  public isEditMode = signal(false);

  public toggleEditMode(): void {
    this.isEditMode.set(!this.isEditMode());
  }

  public cancelEdit(): void {
    if (this.isNew()) {
      this.close.emit();
      return;
    }
    this.isEditMode.set(false);
  }
}
