import { Component, signal, Signal, WritableSignal } from '@angular/core';
import { NotesService } from './notes.service';
import { Note, NoteRequest, UUID } from '@kinpeter/pk-common';
import { PkLoaderComponent } from '../../common/pk-loader.component';
import { PkIconButtonComponent } from '../../common/pk-icon-button.component';
import { NgIcon } from '@ng-icons/core';
import { PkWidgetDirective } from '../../common/pk-widget.directive';
import { WidgetsBarService } from '../main-menu/widgets-bar.service';
import { NoteComponent } from './note.component';
import { NoteFormComponent } from './note-form.component';
import { NotificationService } from '../../services/notification.service';
import { parseError } from '../../utils/parse-error';

@Component({
  selector: 'pk-notes',
  imports: [
    PkLoaderComponent,
    PkIconButtonComponent,
    NgIcon,
    PkWidgetDirective,
    NoteComponent,
    NoteFormComponent,
  ],
  providers: [],
  styles: `
    .container {
      min-height: 300px;
    }

    .note-form {
      padding: 2px;
    }

    main .loader {
      margin-top: 30%;
    }
  `,
  template: `
    <div pkWidget class="container">
      <header>
        <h1>Notes</h1>
        <div class="actions">
          <pk-icon-button tooltip="Create note" (onClick)="startNewNote()">
            <ng-icon name="tablerTextPlus" size="1.2rem" />
          </pk-icon-button>
          <pk-icon-button tooltip="Close" (onClick)="close()">
            <ng-icon name="tablerX" size="1.2rem" />
          </pk-icon-button>
        </div>
      </header>
      <main>
        @if (isEditing()) {
          <div class="note-form">
            <pk-note-form
              [note]="noteToEdit()"
              (cancel)="cancelEditing()"
              (save)="saveNote($event)" />
          </div>
        } @else if (loading()) {
          <div class="loader">
            <pk-loader size="sm" />
          </div>
        } @else {
          <div class="notes-list">
            @for (item of notes(); track item.id) {
              <pk-note
                [note]="item"
                (edit)="startEditNote($event)"
                (pin)="updateNotePinned($event)"
                (archive)="updateNoteArchived($event)"
                (delete)="deleteNote($event)" />
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
  public isEditing = signal(false);
  public noteToEdit: WritableSignal<Note | null> = signal(null);

  constructor(
    private notesService: NotesService,
    private notificationService: NotificationService,
    private widgetsBarService: WidgetsBarService
  ) {
    this.loading = this.notesService.loading;
    this.notes = this.notesService.notes;
  }

  public close(): void {
    this.widgetsBarService.toggleNotes();
  }

  public startNewNote(): void {
    this.noteToEdit.set(null);
    this.isEditing.set(true);
  }

  public startEditNote(id: UUID): void {
    const note = this.notes().find(n => n.id === id);
    if (!note) return;
    this.noteToEdit.set(note);
    this.isEditing.set(true);
  }

  public cancelEditing(): void {
    this.noteToEdit.set(null);
    this.isEditing.set(false);
  }

  public saveNote(values: NoteRequest): void {
    const noteToEdit = this.noteToEdit();
    if (noteToEdit) {
      const note = {
        ...noteToEdit,
        ...values,
      };
      this.notesService.updateNote(noteToEdit.id, note).subscribe({
        next: () => {
          this.notificationService.showSuccess('Note has been updated');
          this.notesService.fetchNotes();
          this.cancelEditing();
        },
        error: e => this.notificationService.showError('Failed to update note: ' + parseError(e)),
      });
    } else {
      this.notesService.createNote({ ...values, archived: false, pinned: false }).subscribe({
        next: () => {
          this.notificationService.showSuccess('Note has been created');
          this.notesService.fetchNotes();
          this.cancelEditing();
        },
        error: e => this.notificationService.showError('Failed to create note: ' + parseError(e)),
      });
    }
  }

  public updateNotePinned(id: UUID): void {
    const note = this.notes().find(n => n.id === id);
    if (!note) return;
    const payload = {
      ...note,
      links: note.links ?? [],
      pinned: !note.pinned,
    };
    this.notesService.updateNote(id, payload).subscribe({
      next: () => {
        this.notificationService.showSuccess('Note has been updated');
        this.notesService.fetchNotes();
      },
      error: e => this.notificationService.showError('Failed to update note: ' + parseError(e)),
    });
  }

  public updateNoteArchived(id: UUID): void {
    const note = this.notes().find(n => n.id === id);
    if (!note) return;
    const payload = {
      ...note,
      links: note.links ?? [],
      archived: !note.archived,
    };
    this.notesService.updateNote(id, payload).subscribe({
      next: () => {
        this.notificationService.showSuccess('Note has been updated');
        this.notesService.fetchNotes();
      },
      error: e => this.notificationService.showError('Failed to update note: ' + parseError(e)),
    });
  }

  public deleteNote(id: string): void {
    const note = this.notes().find(n => n.id === id);
    if (!note) return;
    this.notesService.deleteNote(id).subscribe({
      next: () => {
        this.notificationService.showSuccess('Note has been deleted');
        this.notesService.fetchNotes();
      },
      error: e => this.notificationService.showError('Failed to update note: ' + parseError(e)),
    });
  }
}
