import { Injectable, computed } from '@angular/core';
import { ApiRoutes } from '../../constants';
import { ApiService } from '../../services/api.service';
import { NotificationService } from '../../services/notification.service';
import { Document, DocumentListItem, DocumentRequest, ListResponse, UUID } from '../../types';
import { parseError } from '../../utils/parse-error';
import { Store } from '../../utils/store';
import { catchError, Observable, tap } from 'rxjs';

interface DocsState {
  docList: DocumentListItem[];
  tags: string[];
  documentOpen: Document | null;
  loading: boolean;
}

const initialState: DocsState = {
  docList: [],
  tags: [],
  documentOpen: null,
  loading: false,
};

@Injectable({ providedIn: 'root' })
export class DocsService extends Store<DocsState> {
  constructor(
    private apiService: ApiService,
    private notificationService: NotificationService
  ) {
    super(initialState);
    this.fetchDocList();
  }

  public docList = computed(() => this.state().docList);
  public tags = computed(() => this.state().tags);
  public documentOpen = computed(() => this.state().documentOpen);
  public loading = computed(() => this.state().loading);

  public fetchDocList(): void {
    this.setState({ loading: true, documentOpen: null });
    this.apiService.get<ListResponse<DocumentListItem>>(ApiRoutes.DOCS).subscribe({
      next: res => {
        this.setState({
          docList: res.entities.sort((a, b) => a.title.localeCompare(b.title)),
          tags: Array.from(new Set(res.entities.flatMap(entity => entity.tags))).sort(),
          loading: false,
        });
      },
      error: err => {
        this.notificationService.showError('Could not fetch documents. ' + parseError(err));
        this.setState({ loading: false });
      },
    });
  }

  public openDocument(id: UUID): Observable<Document> {
    this.setState({ loading: true });
    return this.apiService.get<Document>(`${ApiRoutes.DOCS}${id}`).pipe(
      tap(doc => {
        this.setState({ documentOpen: doc, loading: false });
      }),
      catchError(err => {
        this.notificationService.showError('Could not open document. ' + parseError(err));
        this.setState({ loading: false });
        throw err;
      })
    );
  }

  public closeDocument(): void {
    this.setState({ documentOpen: null });
  }

  public createDocument(doc: DocumentRequest): void {
    this.setState({ loading: true });
    this.apiService.post<DocumentRequest, Document>(ApiRoutes.DOCS, doc).subscribe({
      next: () => {
        this.notificationService.showSuccess('Document has been created');
        this.fetchDocList();
      },
      error: err => {
        this.notificationService.showError('Could not create document. ' + parseError(err));
        this.setState({ loading: false });
      },
    });
  }

  public updateDocument(id: UUID, doc: DocumentRequest): void {
    this.setState({ loading: true });
    this.apiService.put<DocumentRequest, Document>(`${ApiRoutes.DOCS}${id}`, doc).subscribe({
      next: () => {
        this.notificationService.showSuccess('Document has been updated');
        this.fetchDocList();
      },
      error: err => {
        this.notificationService.showError('Could not update document. ' + parseError(err));
        this.setState({ loading: false });
      },
    });
  }

  public deleteDocument(id: UUID): void {
    this.setState({ loading: true });
    this.apiService.delete<{ id: UUID }>(`${ApiRoutes.DOCS}${id}`).subscribe({
      next: () => {
        this.notificationService.showSuccess('Document has been deleted');
        this.fetchDocList();
      },
      error: err => {
        this.notificationService.showError('Could not delete document. ' + parseError(err));
        this.setState({ loading: false });
      },
    });
  }
}
