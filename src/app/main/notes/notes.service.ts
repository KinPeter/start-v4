import { computed, Injectable } from '@angular/core';
import { NoteRequest, Note, IdObject, UUID } from '@kinpeter/pk-common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { omit } from '../../utils/objects';
import { parseError } from '../../utils/parse-error';
import { Store } from '../../utils/store';
import { ApiRoutes } from '../../constants';
import { ApiService } from '../../services/api.service';
import { NotificationService } from '../../services/notification.service';
import { parseISO } from 'date-fns';

interface NotesState {
  notes: Note[];
  loading: boolean;
}

const initialState: NotesState = {
  notes: [],
  loading: false,
};

@Injectable({ providedIn: 'root' })
export class NotesService extends Store<NotesState> {
  constructor(
    private apiService: ApiService,
    private notificationService: NotificationService
  ) {
    super(initialState);
    this.fetchNotes();
  }

  public notes = computed(() => this.state().notes);
  public loading = computed(() => this.state().loading);

  public fetchNotes(): void {
    this.setState({ loading: true });
    this.apiService.get<Note[]>(ApiRoutes.NOTES).subscribe({
      next: res => {
        this.setState({
          notes: res
            .sort(
              (a, b) =>
                parseISO(b.createdAt as unknown as string).getTime() -
                parseISO(a.createdAt as unknown as string).getTime()
            )
            .sort((a, b) => (a.pinned === b.pinned ? 0 : a.pinned ? -1 : 1))
            .sort((a, b) => (a.archived === b.archived ? 0 : a.archived ? 1 : -1)),
          loading: false,
        });
      },
      error: err => {
        this.notificationService.showError('Could not fetch notes. ' + parseError(err));
        this.setState({ loading: false });
      },
    });
  }

  public createNote(note: NoteRequest): Observable<Note> {
    this.setState({ loading: true });
    return this.apiService.post<NoteRequest, Note>(ApiRoutes.NOTES, note).pipe(
      tap({
        next: () => this.setState({ loading: false }),
        error: () => this.setState({ loading: false }),
      })
    );
  }

  public updateNote(id: UUID, note: NoteRequest): Observable<Note> {
    this.setState({ loading: true });
    const request = omit(note, ['createdAt', 'userId', 'id']);
    return this.apiService.put<NoteRequest, Note>(ApiRoutes.NOTES + `/${id}`, request).pipe(
      tap({
        next: () => this.setState({ loading: false }),
        error: () => this.setState({ loading: false }),
      })
    );
  }

  public deleteNote(id: UUID): Observable<IdObject> {
    this.setState({ loading: true });
    return this.apiService.delete<IdObject>(ApiRoutes.NOTES + `/${id}`).pipe(
      tap({
        next: () => this.setState({ loading: false }),
        error: () => this.setState({ loading: false }),
      })
    );
  }
}
