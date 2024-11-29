import { Component, Signal } from '@angular/core';
import { NotesService } from './notes.service';
import { Note } from '@kinpeter/pk-common';
import { PkLoaderComponent } from '../../common/pk-loader.component';
import { PkIconButtonComponent } from '../../common/pk-icon-button.component';
import { NgIcon } from '@ng-icons/core';
import { PkWidgetDirective } from '../../common/pk-widget.directive';
import { WidgetsBarService } from '../main-menu/widgets-bar.service';
import { NoteComponent } from './note.component';

@Component({
  selector: 'pk-notes',
  standalone: true,
  imports: [PkLoaderComponent, PkIconButtonComponent, NgIcon, PkWidgetDirective, NoteComponent],
  providers: [],
  styles: `
    .container {
      min-height: 450px;
    }
  `,
  template: `
    <div pkWidget class="container">
      <header>
        <h1>Notes</h1>
        <div class="actions">
          <pk-icon-button>
            <ng-icon name="tablerTextPlus" size="1.2rem" />
          </pk-icon-button>
          <pk-icon-button (onClick)="close()">
            <ng-icon name="tablerX" size="1.2rem" />
          </pk-icon-button>
        </div>
      </header>
      <main>
        <div class="note-form"></div>
        @if (loading()) {
          <div class="loader">
            <pk-loader size="sm" />
          </div>
        } @else {
          <div class="notes-list">
            @for (item of notes(); track item.id) {
              <pk-note [note]="item" />
            }
          </div>
        }
      </main>
    </div>
  `,
})
export class NotesComponent {
  public loading: Signal<boolean>;
  public notes: Signal<Note[]>;

  constructor(
    private notesService: NotesService,
    private widgetsBarService: WidgetsBarService
  ) {
    this.loading = this.notesService.loading;
    this.notes = this.notesService.notes;
  }

  public close(): void {
    this.widgetsBarService.toggleNotes();
  }
}
