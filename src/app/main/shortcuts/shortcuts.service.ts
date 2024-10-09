import { computed, Injectable } from '@angular/core';
import { ShortcutRequest, Shortcut, IdObject, UUID } from '@kinpeter/pk-common';
import { ShortcutCategory, ApiRoutes } from '../../constants';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Store } from '../../utils/store';
import { ApiService } from '../../services/api.service';
import { NotificationService } from '../../services/notification.service';
import { ShortcutsByCategory } from './shortcuts.types';
import { distributeShortcuts } from './shortcuts.utils';
import { parseError } from '../../utils/parse-error';

interface ShortcutState {
  allById: Record<UUID, Shortcut>;
  shortcuts: ShortcutsByCategory;
  loading: boolean;
}

const initialState: ShortcutState = {
  allById: {},
  shortcuts: {
    [ShortcutCategory.TOP]: [],
    [ShortcutCategory.CODING]: [],
    [ShortcutCategory.GOOGLE]: [],
    [ShortcutCategory.CYCLING]: [],
    [ShortcutCategory.FUN]: [],
    [ShortcutCategory.OTHERS]: [],
  },
  loading: false,
};

@Injectable({ providedIn: 'root' })
export class ShortcutsService extends Store<ShortcutState> {
  public shortcuts = computed(() => this.state().shortcuts);
  public loading = computed(() => this.state().loading);

  constructor(
    private apiService: ApiService,
    private notificationService: NotificationService
  ) {
    super(initialState);
    this.fetchShortcuts();
  }

  public getById(id: UUID): Shortcut {
    return this.state().allById[id];
  }

  public fetchShortcuts(): void {
    this.setState({ loading: true });
    this.apiService.get<Shortcut[]>(ApiRoutes.SHORTCUTS).subscribe({
      next: res => {
        const { byCategory, byId } = distributeShortcuts(res);
        this.setState({
          allById: byId,
          shortcuts: byCategory,
          loading: false,
        });
      },
      error: err => {
        this.notificationService.showError('Could not fetch shortcuts. ' + parseError(err));
        this.setState({ loading: false });
      },
    });
  }

  public createShortcut(request: ShortcutRequest): Observable<Shortcut> {
    this.setState({ loading: true });
    return this.apiService.post<ShortcutRequest, Shortcut>(ApiRoutes.SHORTCUTS, request).pipe(
      tap({
        next: () => this.setState({ loading: false }),
        error: () => this.setState({ loading: false }),
      })
    );
  }

  public updateShortcut(request: ShortcutRequest, id: UUID): Observable<Shortcut> {
    this.setState({ loading: true });
    return this.apiService
      .put<ShortcutRequest, Shortcut>(ApiRoutes.SHORTCUTS + `/${id}`, request)
      .pipe(
        tap({
          next: () => this.setState({ loading: false }),
          error: () => this.setState({ loading: false }),
        })
      );
  }

  public deleteShortcut(id: UUID): Observable<IdObject> {
    this.setState({ loading: true });
    return this.apiService.delete<IdObject>(ApiRoutes.SHORTCUTS + `/${id}`).pipe(
      tap({
        next: () => this.setState({ loading: false }),
        error: () => this.setState({ loading: false }),
      })
    );
  }
}
